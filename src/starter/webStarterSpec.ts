import { Controller, Get } from "../component";
import {
  QueryParam,
  RequestParam
} from "../component/httpRequestParameterDecorators";
import { WebStarter } from "./webStarter";

const web: WebStarter = new WebStarter();

web.initializeModule(undefined).then(() => {
  console.log("Starting module");
  const depMaps = new Map<string, any>();
  depMaps.set("ControllerTest", new ControllerTest());
  web.injectDependencies(depMaps).then(() => {
    console.log("deps injected");
  });
});

@Controller("")
export class ControllerTest {
  @Get("/test/:id")
  public getTest(
    @RequestParam("id") id: string,
    @QueryParam("test") test: string
  ): string {
    return id + "test 123:" + test;
  }
}
