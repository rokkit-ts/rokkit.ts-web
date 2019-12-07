import { ControllerInformation } from "../component/util/controllerInformation";
import { RequestMapping } from "../component/util/request/requestMapping";
import { HttpServer } from "../http/server/httpServer";
import { RequestHandlerFactory } from "../http/server/requestHandlerFactory";
import { RestifyHttpServer } from "../http/server/restifyHttpServer";

const HTTP_CONTROLLERS: ControllerInformation[] = [];

export function addHttpController(controller: ControllerInformation) {
  HTTP_CONTROLLERS.push(controller);
}

export class WebStarter {
  private httpServer: HttpServer | undefined;
  private instanceMap: Map<string, any>;
  private requestHandlerFactory: RequestHandlerFactory;

  constructor() {
    this.instanceMap = new Map();
    this.requestHandlerFactory = new RequestHandlerFactory();
  }

  public async injectDependencies(
    instanceMap: Map<string, any>
  ): Promise<void> {
    this.instanceMap = instanceMap;
  }

  public async runModule(configuration: any): Promise<void> {
    this.httpServer = new RestifyHttpServer();
    await this.mapControllerToInstances();
    await this.httpServer.run();
  }

  public async shoutDownModule(): Promise<void> {
    if (this.httpServer) {
      await this.httpServer.stop();
    }
  }

  private async mapControllerToInstances(): Promise<void> {
    await Promise.all(
      HTTP_CONTROLLERS.map(async controllerInformation => {
        const controllerInstance: any = this.instanceMap.get(
          controllerInformation.controllerName
        );
        await Promise.all(
          controllerInformation.resourceMappings.map(requestMapping => {
            this.addRequestHandlerFunctionToHttpServer(
              controllerInstance,
              requestMapping,
              controllerInformation
            );
          })
        );
      })
    );
    return Promise.resolve();
  }

  private addRequestHandlerFunctionToHttpServer(
    controllerInstance: any,
    requestMapping: RequestMapping,
    controllerInformation: ControllerInformation
  ) {
    const handlerFunction = this.requestHandlerFactory.buildHandlerFunction(
      controllerInstance,
      requestMapping
    );
    if (this.httpServer) {
      this.httpServer.addRequestHandler(
        requestMapping.httpMethod,
        controllerInformation.basePath + requestMapping.resourcePath,
        handlerFunction
      );
    }
  }
}
