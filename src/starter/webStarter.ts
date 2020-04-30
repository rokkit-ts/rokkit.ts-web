import { AbstractModule } from '@rokkit.ts/abstract-module'
import { ControllerInformation, RequestMapping } from '../component'
import {
  HttpServer,
  RequestHandlerFactory,
  RestifyHttpServer,
  RokkitServerOptions
} from '../http'
import { RokkitDI } from '@rokkit.ts/dependency-injection'
import { Logger, LoggerFactory } from '@rokkit.ts/logger'
import { Next, Request, Response } from 'restify'

const HTTP_CONTROLLERS: ControllerInformation[] = []

export const registerHttpController = (controller: ControllerInformation) =>
  HTTP_CONTROLLERS.push(controller)

export class WebStarter extends AbstractModule<RokkitServerOptions> {
  private httpServer: HttpServer | undefined
  private logger: Logger

  constructor(webModuleConfig: RokkitServerOptions) {
    super(webModuleConfig)
    this.logger = LoggerFactory.create('WebStarter', true)
  }

  public async runModule(
    restifyServerConfiguration?: RokkitServerOptions
  ): Promise<void> {
    this.logger.info(`Starting the web module`)
    this.httpServer = new RestifyHttpServer(restifyServerConfiguration)
    await this.mapControllerToInstances()
    await this.httpServer.run()
  }

  public async shutdownModule(): Promise<void> {
    this.logger.info(`Shuting down the web module`)
    if (this.httpServer) {
      await this.httpServer.stop()
    }
  }

  private async mapControllerToInstances(): Promise<void> {
    await Promise.all(
      HTTP_CONTROLLERS.map(async controllerInformation => {
        this.logger.debug(
          `Get instance of ${controllerInformation.controllerName} for controller initialization`
        )
        const controllerInstance: any = RokkitDI.singletonOf(
          controllerInformation.controllerName
        )
        await Promise.all(
          controllerInformation.resourceMappings.map(requestMapping => {
            const handlerFunction = RequestHandlerFactory.buildHandlerFunction(
              controllerInstance,
              requestMapping
            )
            this.addRequestHandlerFunctionToHttpServer(
              handlerFunction,
              requestMapping,
              controllerInformation
            )
            this.logger.debug(
              `Mapping ${requestMapping.httpMethod} > ${requestMapping.resourcePath} to instance of ${controllerInformation.controllerName}`
            )
          })
        )
      })
    )
    return Promise.resolve()
  }

  private addRequestHandlerFunctionToHttpServer(
    handlerFunction: (req: Request, res: Response, next: Next) => any,
    requestMapping: RequestMapping,
    controllerInformation: ControllerInformation
  ) {
    if (this.httpServer) {
      this.httpServer.addRequestHandler(
        requestMapping.httpMethod,
        controllerInformation.basePath + requestMapping.resourcePath,
        handlerFunction
      )
    }
  }
}
