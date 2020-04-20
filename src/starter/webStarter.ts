import { AbstractModule } from '@rokkit.ts/abstract-module'
import { ControllerInformation, RequestMapping } from '../component'
import {
  HttpServer,
  RequestHandlerFactory,
  RestifyHttpServer,
  RokkitServerOptions
} from '../http'
import { RokkitDI } from '@rokkit.ts/dependency-injection'

const HTTP_CONTROLLERS: ControllerInformation[] = []

export const registerHttpController = (controller: ControllerInformation) =>
  HTTP_CONTROLLERS.push(controller)

export class WebStarter extends AbstractModule<RokkitServerOptions> {
  private httpServer: HttpServer | undefined

  constructor(webModuleConfig: RokkitServerOptions) {
    super(webModuleConfig)
  }

  public async runModule(
    restifyServerConfiguration?: RokkitServerOptions
  ): Promise<void> {
    this.httpServer = new RestifyHttpServer(restifyServerConfiguration)
    await this.mapControllerToInstances()
    await this.httpServer.run()
  }

  public async shutdownModule(): Promise<void> {
    if (this.httpServer) {
      await this.httpServer.stop()
    }
  }

  private async mapControllerToInstances(): Promise<void> {
    await Promise.all(
      HTTP_CONTROLLERS.map(async controllerInformation => {
        const controllerInstance: any = RokkitDI.singletonOf(
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
