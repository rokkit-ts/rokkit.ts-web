import {ControllerInformation} from "../component/util/controllerInformation";
import {HttpServer} from "../http/server/httpServer";

const HTTP_CONTROLLERS: ControllerInformation[] = [];

export function addHttpController(controller: ControllerInformation) {
  HTTP_CONTROLLERS.push(controller);
}

export class WebStarter {

  private httpServer: HttpServer;

  public async initializeModule(configuration: any): Promise<void>{
     await this.httpServer.run();
  }
  public async injectDependencies(instanceMap: Map<string, any>): Promise<void>{

  }

  public async shoutDownModule(): Promise<void>{
    await this.httpServer.stop();
  }

}