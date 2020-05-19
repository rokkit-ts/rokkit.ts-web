/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
// tslint:disable:no-empty

import { HttpMethod } from '../http'
import {
  Delete,
  Get,
  getRequestMappings,
  Head,
  Options,
  Patch,
  Post,
  Put
} from './httpRequestDecorators'
import { RequestBody } from './httpRequestParameterDecorators'
import { RequestMapping } from './utils/request/requestMapping'
import { RequestParameterType } from './utils/request/requestParameterType'

const compareRequestMappings = (
  a: RequestMapping,
  b: RequestMapping
): boolean => {
  try {
    expect(a).toEqual(b)
    return true
  } catch (e) {
    return false
  }
}

describe('HttpRequestDecorators', () => {
  it('should add metadata for @GET decorator', () => {
    // given
    const expectedMetaData: RequestMapping = {
      resourcePath: '/get',
      httpMethod: HttpMethod.GET,
      methodName: 'get',
      parameters: []
    }

    // when
    const actualMetaData = getRequestMappings(TestClass)
    // then
    expect(actualMetaData).not.toHaveLength(0)
    expect(
      actualMetaData?.filter(metaData =>
        compareRequestMappings(metaData, expectedMetaData)
      )
    ).not.toHaveLength(0)
  })

  it('should add metadata for @GET decorator with Requestbody', () => {
    // given
    const expectedMetaData: RequestMapping = {
      resourcePath: '/body',
      httpMethod: HttpMethod.GET,
      methodName: 'body',
      parameters: [{ type: RequestParameterType.BODY, index: 0, key: '' }]
    }

    // when
    const actualMetaData = getRequestMappings(TestClass)
    // then
    expect(actualMetaData).not.toHaveLength(0)
    expect(
      actualMetaData?.filter(metaData =>
        compareRequestMappings(metaData, expectedMetaData)
      )
    ).not.toHaveLength(0)
  })

  it('should add metadata for @POST decorator', () => {
    // given
    const expectedMetaData: RequestMapping = {
      resourcePath: '/post',
      httpMethod: HttpMethod.POST,
      methodName: 'post',
      parameters: []
    }

    // when
    const actualMetaData = getRequestMappings(TestClass)
    // then
    expect(actualMetaData).not.toHaveLength(0)
    expect(
      actualMetaData?.filter(metaData =>
        compareRequestMappings(metaData, expectedMetaData)
      )
    ).not.toHaveLength(0)
  })

  it('should add metadata for @PUT decorator', () => {
    // given
    const expectedMetaData: RequestMapping = {
      resourcePath: '/put',
      httpMethod: HttpMethod.PUT,
      methodName: 'put',
      parameters: []
    }

    // when
    const actualMetaData = getRequestMappings(TestClass)
    // then
    expect(actualMetaData).not.toHaveLength(0)
    expect(
      actualMetaData?.filter(metaData =>
        compareRequestMappings(metaData, expectedMetaData)
      )
    ).not.toHaveLength(0)
  })

  it('should add metadata for @PATCH decorator', () => {
    // given
    const expectedMetaData: RequestMapping = {
      resourcePath: '/patch',
      httpMethod: HttpMethod.PATCH,
      methodName: 'patch',
      parameters: []
    }

    // when
    const actualMetaData = getRequestMappings(TestClass)
    // then
    expect(actualMetaData).not.toHaveLength(0)
    expect(
      actualMetaData?.filter(metaData =>
        compareRequestMappings(metaData, expectedMetaData)
      )
    ).not.toHaveLength(0)
  })

  it('should add metadata for @DELETE decorator', () => {
    // given
    const expectedMetaData: RequestMapping = {
      resourcePath: '/delete',
      httpMethod: HttpMethod.DELETE,
      methodName: 'delete',
      parameters: []
    }

    // when
    const actualMetaData = getRequestMappings(TestClass)
    // then
    expect(actualMetaData).not.toHaveLength(0)
    expect(
      actualMetaData?.filter(metaData =>
        compareRequestMappings(metaData, expectedMetaData)
      )
    ).not.toHaveLength(0)
  })

  it('should add metadata for @OPTIONS decorator', () => {
    // given
    const expectedMetaData: RequestMapping = {
      resourcePath: '/options',
      httpMethod: HttpMethod.OPTIONS,
      methodName: 'options',
      parameters: []
    }

    // when
    const actualMetaData = getRequestMappings(TestClass)
    // then
    expect(actualMetaData).not.toHaveLength(0)
    expect(
      actualMetaData?.filter(metaData =>
        compareRequestMappings(metaData, expectedMetaData)
      )
    ).not.toHaveLength(0)
  })

  it('should add metadata for @HEAD decorator', () => {
    // given
    const expectedMetaData: RequestMapping = {
      resourcePath: '/head',
      httpMethod: HttpMethod.HEAD,
      methodName: 'head',
      parameters: []
    }

    // when
    const actualMetaData = getRequestMappings(TestClass)
    // then
    expect(actualMetaData).not.toHaveLength(0)
    expect(
      actualMetaData?.filter(metaData =>
        compareRequestMappings(metaData, expectedMetaData)
      )
    ).not.toHaveLength(0)
  })
})

class TestClass {
  @Get('/get')
  public get() {}
  @Get('/body')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public body(@RequestBody() body: any) {}
  @Post('/post')
  public post() {}
  @Put('/put')
  public put() {}
  @Patch('/patch')
  public patch() {}
  @Delete('/delete')
  public delete() {}
  @Head('/head')
  public head() {}
  @Options('/options')
  public options() {}
}
