// tslint:disable:max-classes-per-file
import {
  getRequestParameterByFunctionName,
  QueryParameter,
  Request,
  RequestBody,
  RequestHeader,
  RequestPathParameter,
  Response
} from './httpRequestParameterDecorators'
import { RequestParameter } from './util/request/requestParameter'
import { RequestParameterType } from './util/request/requestParameterType'

describe('HttpRequestParameterDecorators', () => {
  it('should add metadata for RequestBody on function', () => {
    // given
    const instance = new TestClass()
    const expectedMetaData = [
      {
        index: 0,
        key: '',
        type: RequestParameterType.BODY
      }
    ]
    // when
    const actualMetaData = getRequestParameterByFunctionName('body', instance)
    // then
    expect(actualMetaData).not.toHaveLength(0)
    expect(actualMetaData).toEqual(expectedMetaData)
  })

  it('should add metadata for RequestPathParameter with key id on function', () => {
    // given
    const instance = new TestClass()
    const expectedMetaData = [
      {
        index: 0,
        key: 'id',
        type: RequestParameterType.REQUEST_PARAMETER
      }
    ]
    // when
    const actualMetaData = getRequestParameterByFunctionName(
      'requestPathParameter',
      instance
    )
    // then
    expect(actualMetaData).not.toHaveLength(0)
    expect(actualMetaData).toEqual(expectedMetaData)
  })

  it('should add metadata for QueryParameter with key name on function', () => {
    // given
    const instance = new TestClass()
    const expectedMetaData = [
      {
        index: 0,
        key: 'name',
        type: RequestParameterType.QUERY_PARAMETER
      }
    ]
    // when
    const actualMetaData = getRequestParameterByFunctionName(
      'queryParameter',
      instance
    )
    // then
    expect(actualMetaData).not.toHaveLength(0)
    expect(actualMetaData).toEqual(expectedMetaData)
  })

  it('should add metadata for RequestHeader with key forwarded on function', () => {
    // given
    const instance = new TestClass()
    const expectedMetaData = [
      {
        index: 0,
        key: 'forwarded',
        type: RequestParameterType.HEADER
      }
    ]
    // when
    const actualMetaData = getRequestParameterByFunctionName(
      'requestHeader',
      instance
    )
    // then
    expect(actualMetaData).not.toHaveLength(0)
    expect(actualMetaData).toEqual(expectedMetaData)
  })

  it('should add metadata for Request on function', () => {
    // given
    const instance = new TestClass()
    const expectedMetaData = [
      {
        index: 0,
        key: '',
        type: RequestParameterType.REQUEST
      }
    ]
    // when
    const actualMetaData = getRequestParameterByFunctionName(
      'request',
      instance
    )
    // then
    expect(actualMetaData).not.toHaveLength(0)
    expect(actualMetaData).toEqual(expectedMetaData)
  })

  it('should add metadata for Response on function', () => {
    // given
    const instance = new TestClass()
    const expectedMetaData = [
      {
        index: 0,
        key: '',
        type: RequestParameterType.RESPONSE
      }
    ]
    // when
    const actualMetaData = getRequestParameterByFunctionName(
      'response',
      instance
    )
    // then
    expect(actualMetaData).not.toHaveLength(0)
    expect(actualMetaData).toEqual(expectedMetaData)
  })
})

class TestClass {
  // tslint:disable:no-empty
  public body(@RequestBody() body: any) {}
  public requestPathParameter(
    @RequestPathParameter('id') requestParameter: any
  ) {}
  public queryParameter(@QueryParameter('name') query: any) {}
  public requestHeader(@RequestHeader('forwarded') header: string) {}
  public request(@Request() request: any) {}
  public response(@Response() response: any) {}
}
