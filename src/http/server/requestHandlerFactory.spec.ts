import { Request, Response } from 'restify'
import { RequestMapping, RequestParameterType } from '../../component'
import { RequestHandlerFactory } from './requestHandlerFactory'
import { HttpMethod } from '../httpMethod'

describe('RequestHandlerFactory', () => {
  it('should call RequestHandler', () => {
    // given
    const requestMock = {} as Request
    const responeMock = {} as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [],
      resourcePath: ''
    }

    // when
    const requestHandler = RequestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )
    // tslint:disable-next-line: no-empty
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
    const requestHandler = RequestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )
    // tslint:disable-next-line: no-empty
    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(sendMock).toBeCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(200, 'some body')
  })

  it('should call not response send when userHandler returns void', () => {
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
    const requestHandler = RequestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )
    // tslint:disable-next-line: no-empty
    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(sendMock).toBeCalledTimes(0)
  })

  it('should call response  with status 500 when userHandler throws error', () => {
    // given
    const requestMock = {} as Request
    const sendMock = jest.fn()
    const responeMock = { send: sendMock as any } as Response
    const error = new Error('some error')
    const handlerMock = jest.fn().mockImplementation(() => {
      throw error
    })
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [],
      resourcePath: ''
    }

    // when
    const requestHandler = RequestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )
    // tslint:disable-next-line: no-empty
    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toThrowError('some error')
    expect(sendMock).toBeCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith(500, error)
  })

  it('should call next function when calling the the reuqest handler', () => {
    // given
    const requestMock = {} as Request
    const responeMock = {} as Response
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
    const requestHandler = RequestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )
    // tslint:disable-next-line: no-empty
    requestHandler(requestMock, responeMock, nextMock)

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(nextMock).toBeCalledTimes(1)
  })

  it('should call RequestHandler and inject body', () => {
    // given
    const requestMock = { body: 'test' } as Request
    const responeMock = {} as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [{ index: 0, key: '', type: RequestParameterType.BODY }],
      resourcePath: ''
    }

    // when
    const requestHandler = RequestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )
    // tslint:disable-next-line: no-empty
    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith('test')
  })

  it('should call RequestHandler and inject request', () => {
    // given
    const requestMock = { body: 'test' } as Request
    const responeMock = {} as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [{ index: 0, key: '', type: RequestParameterType.REQUEST }],
      resourcePath: ''
    }

    // when
    const requestHandler = RequestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )
    // tslint:disable-next-line: no-empty
    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith({ body: 'test' })
  })

  it('should call RequestHandler and inject response', () => {
    // given
    const requestMock = {} as Request
    const responeMock = { code: 200 } as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [{ index: 0, key: '', type: RequestParameterType.RESPONSE }],
      resourcePath: ''
    }

    // when
    const requestHandler = RequestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )
    // tslint:disable-next-line: no-empty
    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith({ code: 200 })
  })

  it('should call RequestHandler and inject a header', () => {
    // given
    const requestMock = { headers: { forwarded: 'rokkit.dev' } } as Request
    const responeMock = {} as Response
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
    const requestHandler = RequestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )
    // tslint:disable-next-line: no-empty
    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith('rokkit.dev')
  })

  it('should call RequestHandler and inject a request parameter', () => {
    // given
    const requestMock = { params: { id: 12 } } as Request
    const responeMock = {} as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [
        { index: 0, key: 'id', type: RequestParameterType.REQUEST_PARAMETER }
      ],
      resourcePath: ''
    }

    // when
    const requestHandler = RequestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )
    // tslint:disable-next-line: no-empty
    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith(12)
  })

  it('should call RequestHandler and inject a query parameter', () => {
    // given
    const requestMock = { query: { name: 'rokkit.ts' } } as Request
    const responeMock = {} as Response
    const handlerMock = jest.fn()
    const instanceMock = { handler: handlerMock }
    const requestMapping: RequestMapping = {
      httpMethod: HttpMethod.GET,
      methodName: 'handler',
      parameters: [
        { index: 0, key: 'name', type: RequestParameterType.QUERY_PARAMETER }
      ],
      resourcePath: ''
    }

    // when
    const requestHandler = RequestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )
    // tslint:disable-next-line: no-empty
    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith('rokkit.ts')
  })

  it('should call RequestHandler and inject a multiple objects', () => {
    // given
    const requestMock = {
      body: 'some body',
      headers: { forwarded: 'rokkit.dev' }
    } as Request
    const responeMock = {} as Response
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
    const requestHandler = RequestHandlerFactory.buildHandlerFunction(
      instanceMock,
      requestMapping
    )
    // tslint:disable-next-line: no-empty
    requestHandler(requestMock, responeMock, () => {})

    // then
    expect(handlerMock).toBeCalledTimes(1)
    expect(handlerMock).toHaveBeenCalledWith('some body', 'rokkit.dev')
  })
})
