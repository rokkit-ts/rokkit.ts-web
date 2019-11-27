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
  private requestHandlerFactory: RequestHandlerFactory;

  constructor() {
    this.requestHandlerFactory = new RequestHandlerFactory();
  }

  public async initializeModule(configuration: any): Promise<void> {
    this.httpServer = new RestifyHttpServer();
    await this.httpServer.run();
  }

  public async injectDependencies(
    instanceMap: Map<string, any>
  ): Promise<void> {
    Promise.all(
      HTTP_CONTROLLERS.map(async controllerInformation => {
        const controllerInstance: any = instanceMap.get(
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
  }

  public async shoutDownModule(): Promise<void> {
    if (this.httpServer) {
      await this.httpServer.stop();
    }
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
