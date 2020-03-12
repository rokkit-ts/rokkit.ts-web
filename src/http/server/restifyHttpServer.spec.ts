const useMock = jest.fn()
const listenMock = jest.fn()
const closeMock = jest.fn()
const getMock = jest.fn()
const postMock = jest.fn()
const putMock = jest.fn()
const patchMock = jest.fn()
const deleteMock = jest.fn()
const optionsMock = jest.fn()
const headMock = jest.fn()

jest.mock('restify', () => ({
  ...jest.requireActual('restify'),
  createServer: jest.fn().mockReturnValue({
    use: useMock,
    listen: listenMock,
    close: closeMock,
    get: getMock,
    post: postMock,
    put: putMock,
    patch: patchMock,
    del: deleteMock,
    opts: optionsMock,
    head: headMock
  })
}))

import { createServer } from 'restify'
import {
  createDefaultRestifyServer,
  RestifyHttpServer
} from './restifyHttpServer'
import { HttpMethod } from '../httpMethod'

describe('createDefaultRestifyServer', () => {
  it('should create a default server instance', () => {
    // when
    const server = createDefaultRestifyServer()
    // then
    expect(createServer).toHaveBeenCalledTimes(1)
    expect(useMock).toBeCalledTimes(2)
  })
})

describe('RestifyHttpServer', () => {
  test('should call listen when starting the server', async () => {
    // given
    const server = new RestifyHttpServer(createDefaultRestifyServer())
    // when
    await server.run()
    // then
    expect(listenMock).toBeCalledTimes(1)
  })

  test('should call close when stoping the server', async () => {
    // given
    const server = new RestifyHttpServer(createDefaultRestifyServer())
    // when
    await server.stop()
    // then
    expect(closeMock).toBeCalledTimes(1)
  })

  test('should add get handler function based on HttpMethod to the server', () => {
    // given
    const server = new RestifyHttpServer(createDefaultRestifyServer())
    const requestPath = '/test'
    const httpHandler = () => 0
    // when
    server.addRequestHandler(HttpMethod.GET, requestPath, httpHandler)
    // then
    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith(requestPath, httpHandler)
  })

  test('should add post handler function based on HttpMethod to the server', () => {
    // given
    const server = new RestifyHttpServer(createDefaultRestifyServer())
    const requestPath = '/test'
    const httpHandler = () => 0

    // when
    server.addRequestHandler(HttpMethod.POST, requestPath, httpHandler)
    // then
    expect(postMock).toBeCalledTimes(1)
    expect(postMock).toBeCalledWith(requestPath, httpHandler)
  })

  test('should add put handler function based on HttpMethod to the server', () => {
    // given
    const server = new RestifyHttpServer(createDefaultRestifyServer())
    const requestPath = '/test'
    const httpHandler = () => 0
    // when
    server.addRequestHandler(HttpMethod.PUT, requestPath, httpHandler)
    // then
    expect(putMock).toBeCalledTimes(1)
    expect(putMock).toBeCalledWith(requestPath, httpHandler)
  })

  test('should add patch handler function based on HttpMethod to the server', () => {
    // given
    const server = new RestifyHttpServer(createDefaultRestifyServer())
    const requestPath = '/test'
    const httpHandler = () => 0
    // when
    server.addRequestHandler(HttpMethod.PATCH, requestPath, httpHandler)
    // then
    expect(patchMock).toBeCalledTimes(1)
    expect(patchMock).toBeCalledWith(requestPath, httpHandler)
  })

  test('should add patch handler function based on HttpMethod to the server', () => {
    // given
    const server = new RestifyHttpServer(createDefaultRestifyServer())
    const requestPath = '/test'
    const httpHandler = () => 0
    // when
    server.addRequestHandler(HttpMethod.DELETE, requestPath, httpHandler)
    // then
    expect(deleteMock).toBeCalledTimes(1)
    expect(deleteMock).toBeCalledWith(requestPath, httpHandler)
  })

  test('should add patch handler function based on HttpMethod to the server', () => {
    // given
    const server = new RestifyHttpServer(createDefaultRestifyServer())
    const requestPath = '/test'
    const httpHandler = () => 0
    // when
    server.addRequestHandler(HttpMethod.OPTIONS, requestPath, httpHandler)
    // then
    expect(optionsMock).toBeCalledTimes(1)
    expect(optionsMock).toBeCalledWith(requestPath, httpHandler)
  })

  test('should add patch handler function based on HttpMethod to the server', () => {
    // given
    const server = new RestifyHttpServer(createDefaultRestifyServer())
    const requestPath = '/test'
    const httpHandler = () => 0
    // when
    server.addRequestHandler(HttpMethod.HEAD, requestPath, httpHandler)
    // then
    expect(headMock).toBeCalledTimes(1)
    expect(headMock).toBeCalledWith(requestPath, httpHandler)
  })
})
