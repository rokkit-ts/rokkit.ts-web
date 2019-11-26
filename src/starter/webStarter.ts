import {ControllerInformation} from "../component/util/controllerInformation";

const HTTP_CONTROLLERS: ControllerInformation[] = [];

export function addHttpController(controller: ControllerInformation) {
  HTTP_CONTROLLERS.push(controller);
}

export class WebStarter {

  public async initializeModule(configuration: any): Promise<void>{

  }
  public async injectDependencies(instanceMap: Map<string, any>): Promise<void>{

  }

  public async shoutDownModule(): Promise<void>{

  }

}