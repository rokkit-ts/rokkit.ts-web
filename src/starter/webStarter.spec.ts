import { ControllerInformation } from '../component'
import { HttpMethod, RestifyHttpServer } from '../http'
import { registerHttpController, WebStarter } from './webStarter'

jest.mock('../http', () => ({
  ...jest.requireActual('../http'),
  RestifyHttpServer: jest.fn()
}))

describe('WebStarter', () => {
  const runMock = jest.fn()
  const stopMock = jest.fn()
  const addRequestHandlerMock = jest.fn()

  beforeEach(() => {
    runMock.mockClear()
    stopMock.mockClear()
    ;((RestifyHttpServer as unknown) as jest.Mock).mockClear()
    ;((RestifyHttpServer as unknown) as jest.Mock).mockImplementation(() => ({
      run: runMock,
      stop: stopMock,
      addRequestHandler: addRequestHandlerMock
    }))
  })

  it('should create and start restifyServer when running the module', async () => {
    // given
    const restifyServerConfig = undefined
    // when
    const webModule = new WebStarter()
    await webModule.runModule(restifyServerConfig)
    // then
    expect(RestifyHttpServer).toBeCalledTimes(1)
    expect(RestifyHttpServer).toBeCalledWith(restifyServerConfig)
    expect(runMock).toBeCalledTimes(1)
  })

  it('should add registered controller to the restiyServer', async () => {
    // given
    const instance = jest.fn().mockImplementation(() => ({}))
    const controller: ControllerInformation = {
      basePath: '/test',
      controllerName: 'some name',
      resourceMappings: [
        {
          methodName: 'call',
          httpMethod: HttpMethod.GET,
          parameters: [],
          resourcePath: '/call'
        }
      ]
    }
    const instances = new Map<string, any>()
    instances.set('some name', instance)
    // when
    registerHttpController(controller)
    const webModule = new WebStarter()
    await webModule.injectDependencies(instances)
    await webModule.runModule(undefined)
    // then
    expect(addRequestHandlerMock).toBeCalledTimes(1)
    expect(addRequestHandlerMock).toBeCalledWith(
      HttpMethod.GET,
      '/test/call',
      expect.anything()
    )
  })

  it('should call stop on http server when the module was started before', async () => {
    // given
    const restifyServerConfig = undefined
    // when
    const webModule = new WebStarter()
    await webModule.runModule(restifyServerConfig)
    await webModule.shoutDownModule()
    // then
    expect(stopMock).toBeCalledTimes(1)
  })

  it('should not call stop when the module was not started', async () => {
    // given
    const restifyServerConfig = undefined
    // when
    const webModule = new WebStarter()
    await webModule.shoutDownModule()
    // then
    expect(stopMock).toBeCalledTimes(0)
  })
})
