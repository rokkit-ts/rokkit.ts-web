// tslint:disable:max-classes-per-file
// tslint:disable:no-unused-expression
// tslint:disable:no-empty

import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import { HttpMethod } from "../http";
import {
  Delete,
  Get,
  getRequestMappings,
  Head,
  Options,
  Patch,
  Post,
  Put
} from "./httpRequestDecorators";
import { RequestBody } from "./httpRequestParameterDecorators";
import { RequestMapping } from "./util/request/requestMapping";

const requestPath = "/test";

@suite
export class HttpRequestDecoratorsSpec {
  private static checkResourceMapping(
    httpRequestDecorators: RequestMapping[],
    index: number,
    methodName: string,
    httpMethod: HttpMethod
  ) {
    expect(httpRequestDecorators[index].resourcePath).to.be.eq(requestPath);
    expect(httpRequestDecorators[index].methodName).to.be.eq(methodName);
    expect(httpRequestDecorators[index].httpMethod).to.be.eq(httpMethod);
    expect(httpRequestDecorators[index].parameters).to.not.be.undefined;
  }

  @test
  public shouldFindAllHttpRequestMethodsOnObject() {
    const httpRequestDecorators = getRequestMappings(
      TestClass
    ) as RequestMapping[];
    expect(httpRequestDecorators).to.not.be.undefined;
    expect(httpRequestDecorators).to.not.be.empty;
    expect(httpRequestDecorators.length).to.be.eq(7);

    // GET
    HttpRequestDecoratorsSpec.checkResourceMapping(
      httpRequestDecorators,
      0,
      "get",
      HttpMethod.GET
    );
    expect(httpRequestDecorators[0].parameters).to.not.be.empty;
    // POST
    HttpRequestDecoratorsSpec.checkResourceMapping(
      httpRequestDecorators,
      1,
      "post",
      HttpMethod.POST
    );
    expect(httpRequestDecorators[1].parameters).to.be.empty;
    // PUT
    HttpRequestDecoratorsSpec.checkResourceMapping(
      httpRequestDecorators,
      2,
      "put",
      HttpMethod.PUT
    );
    expect(httpRequestDecorators[2].parameters).to.be.empty;
    // PATCH
    HttpRequestDecoratorsSpec.checkResourceMapping(
      httpRequestDecorators,
      3,
      "patch",
      HttpMethod.PATCH
    );
    expect(httpRequestDecorators[3].parameters).to.be.empty;
    // DELETE
    HttpRequestDecoratorsSpec.checkResourceMapping(
      httpRequestDecorators,
      4,
      "delete",
      HttpMethod.DELETE
    );
    expect(httpRequestDecorators[4].parameters).to.be.empty;
    // HEAD
    HttpRequestDecoratorsSpec.checkResourceMapping(
      httpRequestDecorators,
      5,
      "head",
      HttpMethod.HEAD
    );
    expect(httpRequestDecorators[5].parameters).to.be.empty;
    // OPTIONS
    HttpRequestDecoratorsSpec.checkResourceMapping(
      httpRequestDecorators,
      6,
      "options",
      HttpMethod.OPTIONS
    );
    expect(httpRequestDecorators[6].parameters).to.be.empty;
  }
}

class TestClass {
  @Get(requestPath)
  public get(@RequestBody() body: any) {}
  @Post(requestPath)
  public post() {}
  @Put(requestPath)
  public put() {}
  @Patch(requestPath)
  public patch() {}
  @Delete(requestPath)
  public delete() {}
  @Head(requestPath)
  public head() {}
  @Options(requestPath)
  public options() {}
}
