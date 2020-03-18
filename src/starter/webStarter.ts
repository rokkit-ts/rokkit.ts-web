import { AbstractModule } from '@rokkit.ts/abstract-module'
import { ControllerInformation, RequestMapping } from '../component'
import {
  HttpServer,
  RequestHandlerFactory,
  RestifyHttpServer,
  RokkitServerOptions
} from '../http'
import { Server } from 'restify'

const HTTP_CONTROLLERS: ControllerInformation[] = []

export const registerHttpController = (controller: ControllerInformation) =>
  HTTP_CONTROLLERS.push(controller)

export class WebStarter extends AbstractModule {
  private httpServer: HttpServer | undefined

  constructor() {
    super()
  }

  public async injectDependencies(
    instanceMap: Map<string, any>
  ): Promise<void> {
    this.instanceMap = instanceMap
  }

  public async runModule(
    restifyServerConfiguration?: RokkitServerOptions
  ): Promise<void> {
    this.httpServer = new RestifyHttpServer(restifyServerConfiguration)
    await this.mapControllerToInstances()
    await this.httpServer.run()
  }

  public async shoutDownModule(): Promise<void> {
    if (this.httpServer) {
      await this.httpServer.stop()
    }
  }

  private async mapControllerToInstances(): Promise<void> {
    await Promise.all(
      HTTP_CONTROLLERS.map(async controllerInformation => {
        const controllerInstance: any = this.instanceMap.get(
          controllerInformation.controllerName
        )
        await Promise.all(
          controllerInformation.resourceMappings.map(requestMapping => {
            this.addRequestHandlerFunctionToHttpServer(
              controllerInstance,
              requestMapping,
              controllerInformation
            )
          })
        )
      })
    )
    return Promise.resolve()
  }

  private addRequestHandlerFunctionToHttpServer(
    controllerInstance: any,
    requestMapping: RequestMapping,
    controllerInformation: ControllerInformation
  ) {
    const handlerFunction = RequestHandlerFactory.buildHandlerFunction(
      controllerInstance,
      requestMapping
    )
    if (this.httpServer) {
      this.httpServer.addRequestHandler(
        requestMapping.httpMethod,
        controllerInformation.basePath + requestMapping.resourcePath,
        handlerFunction
      )
    }
  }
}
