/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable max-classes-per-file */
import { Request, Response } from 'restify'
import { RequestMapping, RequestParameterType } from '../../component'
import { RequestHandlerFactory } from './requestHandlerFactory'
import { HttpMethod } from '../httpMethod'
import { BasicObjectMapper } from '../objectMapper/BasicObjectMapper'

describe('RequestHandlerFactory', () => {
  it('should call RequestHandler', () => {
    // given
    const requestMock = {} as Request
    const responeMock = { send: jest.fn() as any } as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [],
      resourcePath: ''
    }

    // when
    const requestHandlerFactory = new RequestHandlerFactory(
      new BasicObjectMapper()
    )
    const requestHandler = requestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )

    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
  })

  it('should call response send when userHandler returns non void', () => {
    // given
    const requestMock = {} as Request
    const sendMock = jest.fn()
    const responeMock = { send: sendMock as any } as Response
    const handlerMock = jest.fn()
    handlerMock.mockReturnValue('some body')
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [],
      resourcePath: ''
    }

    // when
    const requestHandlerFactory = new RequestHandlerFactory(
      new BasicObjectMapper()
    )
    const requestHandler = requestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )

    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(sendMock).toBeCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(200, 'some body')
  })

  it('should send 500 send when userHandler returns undefined', () => {
    // given
    const requestMock = {} as Request
    const sendMock = jest.fn()
    const responeMock = { send: sendMock as any } as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [],
      resourcePath: ''
    }

    // when
    const requestHandlerFactory = new RequestHandlerFactory(
      new BasicObjectMapper()
    )
    const requestHandler = requestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )

    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(sendMock).toBeCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(
      500,
      'Request handler completed with undefined --> most likely the function returns nothing'
    )
  })

  it('should call response  with status 500 when userHandler throws error', () => {
    // given
    const requestMock = {} as Request
    const sendMock = jest.fn()
    const responeMock = { send: sendMock as any } as Response
    const handlerMock = jest.fn().mockImplementation(() => {
      throw new Error('some error')
    })
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [],
      resourcePath: ''
    }

    // when
    const requestHandlerFactory = new RequestHandlerFactory(
      new BasicObjectMapper()
    )
    const requestHandler = requestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )

    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toThrowError('some error')
    expect(sendMock).toBeCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(500, 'some error')
  })

  it('should call next function when calling the the reuqest handler', () => {
    // given
    const requestMock = {} as Request
    const responeMock = { send: jest.fn() as any } as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [],
      resourcePath: ''
    }
    const nextMock = jest.fn()

    // when
    const requestHandlerFactory = new RequestHandlerFactory(
      new BasicObjectMapper()
    )
    const requestHandler = requestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )

    requestHandler(requestMock, responeMock, nextMock)

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(nextMock).toBeCalledTimes(1)
  })

  it('should call RequestHandler and inject body with json', () => {
    // given
    const requestMock = {
      body: { data: 'test', subClass: { data: 1 } }
    } as Request
    const responeMock = { send: jest.fn() as any } as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [
        {
          index: 0,
          key: '',
          type: RequestParameterType.BODY,
          bodyType: BodyClass
        }
      ],
      resourcePath: ''
    }

    // when
    const requestHandlerFactory = new RequestHandlerFactory(
      new BasicObjectMapper()
    )
    const requestHandler = requestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )

    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith(
      new BodyClass('test', new SubClass(1))
    )
  })

  it('should call RequestHandler and inject body with json string', () => {
    // given
    const requestMock = {
      body: '{ "data": "test", "subClass": { "data":1 } }'
    } as Request
    const responeMock = { send: jest.fn() as any } as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [
        {
          index: 0,
          key: '',
          type: RequestParameterType.BODY,
          bodyType: BodyClass
        }
      ],
      resourcePath: ''
    }

    // when
    const requestHandlerFactory = new RequestHandlerFactory(
      new BasicObjectMapper()
    )
    const requestHandler = requestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )

    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith(
      new BodyClass('test', new SubClass(1))
    )
  })

  it('should call RequestHandler and inject body without Type', () => {
    // given
    const requestMock = { body: '{ "data" : "test" }' } as Request
    const responeMock = { send: jest.fn() as any } as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [
        {
          index: 0,
          key: '',
          type: RequestParameterType.BODY
        }
      ],
      resourcePath: ''
    }

    // when
    const requestHandlerFactory = new RequestHandlerFactory(
      new BasicObjectMapper()
    )
    const requestHandler = requestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )

    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith({ data: 'test' })
  })

  it('should send 500 when body is not Parsable to type', () => {
    // given
    const requestMock = { body: ' "data" : "test" ' } as Request
    const sendMock = jest.fn()
    const responeMock = { send: sendMock as any } as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [
        {
          index: 0,
          key: '',
          type: RequestParameterType.BODY,
          bodyType: BodyClass
        }
      ],
      resourcePath: ''
    }

    // when
    const requestHandlerFactory = new RequestHandlerFactory(
      new BasicObjectMapper()
    )
    const requestHandler = requestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )

    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(sendMock).toBeCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(
      500,
      'Not able to parse data to JSON: Unexpected token : in JSON at position 8'
    )
  })

  it('should call RequestHandler and inject request', () => {
    // given
    const requestMock = { body: 'test' } as Request
    const responeMock = { send: jest.fn() as any } as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [{ index: 0, key: '', type: RequestParameterType.REQUEST }],
      resourcePath: ''
    }

    // when
    const requestHandlerFactory = new RequestHandlerFactory(
      new BasicObjectMapper()
    )
    const requestHandler = requestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )

    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith({ body: 'test' })
  })

  it('should call RequestHandler and inject response', () => {
    // given
    const requestMock = {} as Request
    const responeMock = { send: jest.fn() as any, code: 200 } as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [{ index: 0, key: '', type: RequestParameterType.RESPONSE }],
      resourcePath: ''
    }

    // when
    const requestHandlerFactory = new RequestHandlerFactory(
      new BasicObjectMapper()
    )
    const requestHandler = requestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )

    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith({
      code: 200,
      send: expect.any(Function)
    })
  })

  it('should call RequestHandler and inject a header', () => {
    // given
    const requestMock = { headers: { forwarded: 'rokkit.dev' } } as Request
    const responeMock = { send: jest.fn() as any } as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [
        { index: 0, key: 'forwarded', type: RequestParameterType.HEADER }
      ],
      resourcePath: ''
    }

    // when
    const requestHandlerFactory = new RequestHandlerFactory(
      new BasicObjectMapper()
    )
    const requestHandler = requestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )

    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith('rokkit.dev')
  })

  it('should call RequestHandler and inject a request parameter', () => {
    // given
    const requestMock = { params: { id: 12 } } as Request
    const responeMock = { send: jest.fn() as any } as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [
        {
          index: 0,
          key: 'id',
          type: RequestParameterType.REQUEST_PATH_PARAMETER
        }
      ],
      resourcePath: ''
    }

    // when
    const requestHandlerFactory = new RequestHandlerFactory(
      new BasicObjectMapper()
    )
    const requestHandler = requestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )

    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith(12)
  })

  it('should call RequestHandler and inject a query parameter', () => {
    // given
    const requestMock = { query: { name: 'rokkit.ts' } } as Request
    const responeMock = { send: jest.fn() as any } as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [
        {
          index: 0,
          key: 'name',
          type: RequestParameterType.REQUEST_QUERY_PARAMETER
        }
      ],
      resourcePath: ''
    }

    // when
    const requestHandlerFactory = new RequestHandlerFactory(
      new BasicObjectMapper()
    )
    const requestHandler = requestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )
    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith('rokkit.ts')
  })

  it('should call RequestHandler and inject a multiple objects', () => {
    // given
    const requestMock = {
      body: '{"test":"some body"}',
      headers: { forwarded: 'rokkit.dev' }
    } as Request
    const responeMock = { send: jest.fn() as any } as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [
        { index: 0, key: '', type: RequestParameterType.BODY },
        { index: 1, key: 'forwarded', type: RequestParameterType.HEADER }
      ],
      resourcePath: ''
    }

    // when
    const requestHandlerFactory = new RequestHandlerFactory(
      new BasicObjectMapper()
    )
    const requestHandler = requestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )

    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith(
      { test: 'some body' },
      'rokkit.dev'
    )
  })
})

class SubClass {
  private data: number
  public constructor(data: number) {
    this.data = data
  }
}
// tslint:disable-next-line: max-classes-per-file
class BodyClass {
  private data: string
  private subClass: SubClass
  public constructor(data: string, subClass: SubClass) {
    this.data = data
    this.subClass = subClass
  }
}
