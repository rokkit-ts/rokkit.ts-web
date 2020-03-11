import { expect } from 'chai'
import { suite, test } from 'mocha-typescript'
import { Request, Response } from 'restify'
import { RequestMapping } from '../../component/util/request/requestMapping'
import { RequestParameterType } from '../../component/util/request/requestParameterType'
import { RequestHandlerFactory } from './requestHandlerFactory'

@suite
export class RequestHandlerFactorySpec {
  @test
  public shouldCreateRequestHandlerFunction() {
    // Given
    const expectedResponseSendCount = 1
    const expectedNextHandlerCount = 1
    const expectedInstanceCount = 1
    const expectedBodyValue = 'TEST-BODY-VALUE'
    const expectedPathValue = 'TEST-PATH-VALUE'
    const expectedQueryValue = 'TEST-QUERY-VALUE'

    const instance = new TestClass()
    let responseSendCount = 0
    let nextCallCount = 0
    let responseSendBody = ''
    const requestMapping = {
      methodName: 'fakeHandler',
      parameters: [
        {
          index: 0,
          key: '',
          type: RequestParameterType.BODY
        },
        {
          index: 1,
          key: 'test',
          type: RequestParameterType.REQUEST_PARAMETER
        },
        {
          index: 2,
          key: 'test',
          type: RequestParameterType.QUERY_PARAMETER
        },
        {
          index: 3,
          key: '',
          type: RequestParameterType.REQUEST
        },
        {
          index: 4,
          key: '',
          type: RequestParameterType.RESPONSE
        }
      ]
    } as RequestMapping

    const handler = RequestHandlerFactory.buildHandlerFunction(
      instance,
      requestMapping
    )

    const requestMock = {
      body: expectedBodyValue,
      params: { test: expectedPathValue },
      query: { test: expectedQueryValue }
    } as Request

    const responseMock = {
      send(code?: number, body?: any, headers?: { [p: string]: string }): any {
        expect(code).to.eq(200)
        responseSendBody = body as string
        responseSendCount++
      }
    } as Response

    const nextHandler = () => {
      nextCallCount++
    }

    // When
    handler(requestMock, responseMock, nextHandler)

    // Then
    expect(instance.called).to.eq(expectedInstanceCount)
    expect(instance.actualInput).to.eq(expectedBodyValue)
    expect(instance.actualPath).to.eq(expectedPathValue)
    expect(instance.actualQuery).to.eq(expectedQueryValue)
    expect(instance.actualReq).to.eq(requestMock)
    expect(instance.actualRes).to.eq(responseMock)
    expect(responseSendCount).to.eq(expectedResponseSendCount)
    expect(responseSendBody).to.eq(expectedBodyValue)
    expect(nextCallCount).to.eq(expectedNextHandlerCount)
  }
}

// tslint:disable-next-line:max-classes-per-file
class TestClass {
  public called = 0
  public actualPath = ''
  public actualInput = ''
  public actualQuery = ''
  public actualReq = {} as Request
  public actualRes = {} as Response

  public fakeHandler(
    input: string,
    path: string,
    query: string,
    req: Request,
    res: Response
  ): string {
    this.actualInput = input
    this.actualPath = path
    this.actualQuery = query
    this.actualReq = req
    this.actualRes = res
    this.called++

    return input
  }
}
