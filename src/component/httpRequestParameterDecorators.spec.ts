// tslint:disable:max-classes-per-file
import {
  getRequestParameterByFunctionName,
  RequestQueryParameter,
  Request,
  RequestBody,
  RequestHeader,
  RequestPathParameter,
  Response
} from './httpRequestParameterDecorators'
import { RequestParameterType } from './utils'

describe('HttpRequestParameterDecorators', () => {
  it('should add metadata for RequestBody on function', () => {
    // given
    const instance = new TestClass()
    const expectedMetaData = [
      {
        index: 0,
        key: '',
        type: RequestParameterType.BODY,
        bodyType: BodyDate
      }
    ]
    // when
    const actualMetaData = getRequestParameterByFunctionName('body', instance)
    // then
    expect(actualMetaData).not.toHaveLength(0)
    expect(actualMetaData).toEqual(expectedMetaData)
  })

  it('should add metadata for RequestBody on function without BodyType', () => {
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
    const actualMetaData = getRequestParameterByFunctionName(
      'bodyWithOutType',
      instance
    )
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
        type: RequestParameterType.REQUEST_PATH_PARAMETER
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
        type: RequestParameterType.REQUEST_QUERY_PARAMETER
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

class BodyDate {
  private data = 'test'
  get Data() {
    return this.data
  }
}

class TestClass {
  // tslint:disable:no-empty
  public body(@RequestBody(BodyDate) body: BodyDate) {}
  public bodyWithOutType(@RequestBody() body: BodyDate) {}
  public requestPathParameter(
    @RequestPathParameter('id') requestParameter: any
  ) {}
  public queryParameter(@RequestQueryParameter('name') query: any) {}
  public requestHeader(@RequestHeader('forwarded') header: string) {}
  public request(@Request() request: any) {}
  public response(@Response() response: any) {}
}
