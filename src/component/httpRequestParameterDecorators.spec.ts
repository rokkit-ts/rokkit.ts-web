// tslint:disable:max-classes-per-file
import { expect } from "chai";
import { suite, test } from "mocha-typescript";
import {
  getRequestParameterByFunctionName,
  QueryParameter,
  Request,
  RequestBody,
  RequestHeader,
  RequestPathParameter,
  Response
} from "./httpRequestParameterDecorators";
import { RequestParameter } from "./util/request/requestParameter";
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
    if (
      requestParameter?.type !== RequestParameterType.BODY &&
      requestParameter?.type !== RequestParameterType.REQUEST &&
      requestParameter?.type !== RequestParameterType.RESPONSE
    ) {
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
      requestParameters[5],
      0,
      RequestParameterType.BODY
    );
    HttpRequestParameterDecoratorsSpec.checkRequestParameter(
      requestParameters[4],
      1,
      RequestParameterType.REQUEST_PARAMETER
    );
    HttpRequestParameterDecoratorsSpec.checkRequestParameter(
      requestParameters[3],
      2,
      RequestParameterType.QUERY_PARAMETER
    );
    HttpRequestParameterDecoratorsSpec.checkRequestParameter(
      requestParameters[2],
      3,
      RequestParameterType.HEADER
    );
    HttpRequestParameterDecoratorsSpec.checkRequestParameter(
      requestParameters[1],
      4,
      RequestParameterType.REQUEST
    );
    HttpRequestParameterDecoratorsSpec.checkRequestParameter(
      requestParameters[0],
      5,
      RequestParameterType.RESPONSE
    );
  }
}

class TestClass {
  // tslint:disable:no-empty
  public testFunction(
    @RequestBody() body: any,
    @RequestPathParameter(parameterKey) requestParameter: any,
    @QueryParameter(parameterKey) query: any,
    @RequestHeader(parameterKey) header: any,
    @Request() request: any,
    @Response() response: any
  ) {}
}
