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
import { ObjectMapper } from '../http/objectMapper/ObjectMapper'
import { BasicObjectMapper } from '../http/objectMapper/BasicObjectMapper'

const HTTP_CONTROLLERS: ControllerInformation[] = []

export const registerHttpController = (
  controller: ControllerInformation
): void => {
  HTTP_CONTROLLERS.push(controller)
}

export class WebStarter extends AbstractModule<RokkitServerOptions> {
  private httpServer: HttpServer | undefined
  private objectMapper: ObjectMapper
  private requestHandlerFactory: RequestHandlerFactory
  private logger: Logger

  public constructor(webModuleConfig: RokkitServerOptions) {
    super(webModuleConfig)
    this.logger = LoggerFactory.create('WebStarter', true)
    this.objectMapper = new BasicObjectMapper()
    this.requestHandlerFactory = new RequestHandlerFactory(this.objectMapper)
  }

  public async runModule(
    restifyServerConfiguration?: RokkitServerOptions
  ): Promise<void> {
    this.logger.info('Starting the web module')
    this.httpServer = new RestifyHttpServer(restifyServerConfiguration)
    await this.mapControllerToInstances()
    await this.httpServer.run()
  }

  public async shutdownModule(): Promise<void> {
    this.logger.info('Shuting down the web module')
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
            const handlerFunction = this.requestHandlerFactory.buildHandlerFunction(
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
  ): void {
    if (this.httpServer) {
      this.httpServer.addRequestHandler(
        requestMapping.httpMethod,
        controllerInformation.basePath + requestMapping.resourcePath,
        handlerFunction
      )
    }
  }
}
