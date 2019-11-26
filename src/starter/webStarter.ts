import {ControllerInformation} from "../component/util/controllerInformation";
import {HttpServer} from "../http/server/httpServer";
import {RestifyHttpServer} from "../http/server/restifyHttpServer";
import {RequestHandlerFactory} from "../http/server/RequestHandlerFactory";

const HTTP_CONTROLLERS: ControllerInformation[] = [];

export function addHttpController(controller: ControllerInformation) {
  HTTP_CONTROLLERS.push(controller);
}

export class WebStarter {

  private httpServer: HttpServer | undefined;
  private requestHandlerFactory: RequestHandlerFactory;

  constructor(){
    this.requestHandlerFactory = new RequestHandlerFactory();
  }

  public async initializeModule(configuration: any): Promise<void>{
    this.httpServer = new RestifyHttpServer();
     await this.httpServer.run();
  }
  public async injectDependencies(instanceMap: Map<string, any>): Promise<void>{
  }

  public async shoutDownModule(): Promise<void>{
    if (this.httpServer){
      await this.httpServer.stop();
    }
  }

}

