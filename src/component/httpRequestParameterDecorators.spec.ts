// tslint:disable:max-classes-per-file
import { suite, test } from "mocha-typescript";
import {
  getRequestParameterByFunctionName,
  QueryParam,
  RequestBody,
  RequestHeader,
  RequestParam
} from "./httpRequestParameterDecorators";
import { RequestParameter } from "./util/request/requestParameter";
import { expect } from "chai";
import { RequestParameterType } from "./util/request/requestParameterType";

const parameterKey = "test-key";

@suite
export class HttpRequestParameterDecoratorsSpec {
  private static checkRequestParameter(
    requestParameter: RequestParameter | undefined,
    paramIndex: number,
    requestParameterType: RequestParameterType
  ) {
    // tslint:disable-next-line:no-unused-expression
    expect(requestParameter).to.not.be.undefined;
    expect(requestParameter?.index).to.be.eq(paramIndex);
    expect(requestParameter?.type).to.be.eq(requestParameterType);
    if (requestParameter?.type !== RequestParameterType.BODY) {
      expect(requestParameter?.key).to.be.eq(parameterKey);
    }
  }

  @test
  public shouldFindAllRequestParametersOnObject() {
    const requestParameters = getRequestParameterByFunctionName(
      "testFunction",
      new TestClass()
    ) as RequestParameter[];

    // tslint:disable:no-unused-expression
    expect(requestParameters).to.not.be.undefined;
    expect(requestParameters).to.not.be.empty;

    HttpRequestParameterDecoratorsSpec.checkRequestParameter(
      requestParameters[3],
      0,
      RequestParameterType.BODY
    );
    HttpRequestParameterDecoratorsSpec.checkRequestParameter(
      requestParameters[2],
      1,
      RequestParameterType.REQUEST_PARAMETER
    );
    HttpRequestParameterDecoratorsSpec.checkRequestParameter(
      requestParameters[1],
      2,
      RequestParameterType.QUERY_PARAMETER
    );
    HttpRequestParameterDecoratorsSpec.checkRequestParameter(
      requestParameters[0],
      3,
      RequestParameterType.HEADER
    );
  }
}

class TestClass {
  // tslint:disable:no-empty
  public testFunction(
    @RequestBody() body: any,
    @RequestParam(parameterKey) requestParameter: any,
    @QueryParam(parameterKey) query: any,
    @RequestHeader(parameterKey) header: any
  ) {}
}
