// tslint:disable:max-classes-per-file
// tslint:disable:no-unused-expression

import dependencyInjectionAssembler from "@rokkit.ts/dependency-injection/lib/dependency-injection-assembler/dependencyInjectionAssembler";
import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import * as sinon from "sinon";
import { HttpMethod } from "../http";
import * as starterModule from "../starter";
import { Controller } from "./controllerDecorator";
import { Post } from "./httpRequestDecorators";
import { RequestBody } from "./httpRequestParameterDecorators";
import { ControllerInformation } from "./util/controllerInformation";
import { RequestParameterType } from "./util/request/requestParameterType";

sinon
  .stub(starterModule, "registerHttpController")
  .callsFake((controllerInformation: ControllerInformation) => {
    controllers.push(controllerInformation);
  });

const controllers: ControllerInformation[] = [];
const requestPath = "/test";
const fileName = __filename;
const contextName = "TEST";

@suite
class ControllerDecoratorSpec {
  @test
  public shouldMarkClassAsController() {
    const context = dependencyInjectionAssembler.retrieveContext(contextName);
    const injector = context?.getInjector(TestControllerClass.name);

    expect(context).to.not.be.undefined;
    expect(injector).to.not.be.undefined;
    expect(controllers).to.not.be.empty;
    expect(controllers.length).to.be.eq(1);
    expect(controllers[0].basePath).to.be.eq(requestPath);
    expect(controllers[0].controllerName).to.be.eq(TestControllerClass.name);
    expect(controllers[0].resourceMappings).to.not.be.undefined;
    expect(controllers[0].resourceMappings).to.not.be.empty;
    expect(controllers[0].resourceMappings[0]).to.not.be.undefined;
    expect(controllers[0].resourceMappings[0].httpMethod).to.be.eq(
      HttpMethod.POST
    );
    expect(controllers[0].resourceMappings[0].methodName).to.be.eq(
      "postMethod"
    );
    expect(controllers[0].resourceMappings[0].resourcePath).to.be.eq(
      requestPath
    );
    expect(controllers[0].resourceMappings[0].parameters).to.not.be.empty;
    expect(controllers[0].resourceMappings[0].parameters[0]).to.not.be
      .undefined;
    expect(controllers[0].resourceMappings[0].parameters[0].index).to.be.eq(0);
    expect(controllers[0].resourceMappings[0].parameters[0].key).to.be.eq("");
    expect(controllers[0].resourceMappings[0].parameters[0].type).to.be.eq(
      RequestParameterType.BODY
    );
  }
}

@Controller(requestPath, fileName, contextName)
class TestControllerClass {
  @Post(requestPath)
  // tslint:disable-next-line:no-empty
  public postMethod(@RequestBody() body: any) {}
}
