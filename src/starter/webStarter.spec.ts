import { ControllerInformation } from '../component'
import { HttpMethod, RestifyHttpServer } from '../http'
import { registerHttpController, WebStarter } from './webStarter'
import { RokkitDI } from '@rokkit.ts/dependency-injection'
import { mocked } from 'ts-jest/utils'

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
    mocked(RestifyHttpServer).mockClear()
    mocked(RestifyHttpServer).mockImplementation(
      () =>
        (({
          run: runMock,
          stop: stopMock,
          addRequestHandler: addRequestHandlerMock
        } as unknown) as RestifyHttpServer)
    )
  })

  it('should create and start restifyServer when running the module', async () => {
    // given
    const restifyServerConfig = undefined
    // when
    const webModule = new WebStarter({})
    await webModule.runModule(restifyServerConfig)
    // then
    expect(RestifyHttpServer).toBeCalledTimes(1)
    expect(RestifyHttpServer).toBeCalledWith(restifyServerConfig)
    expect(runMock).toBeCalledTimes(1)
  })

  it('should add registered controller to the restiyServer', async () => {
    // given
    const controller: ControllerInformation = {
      basePath: '/test',
      controllerName: 'TestClass',
      resourceMappings: [
        {
          methodName: 'call',
          httpMethod: HttpMethod.GET,
          parameters: [],
          resourcePath: '/call'
        }
      ]
    }

    RokkitDI.registerInjectable(TestClass)

    // when
    registerHttpController(controller)
    const webModule = new WebStarter({})
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
    const webModule = new WebStarter({})
    await webModule.runModule(restifyServerConfig)
    await webModule.shutdownModule()
    // then
    expect(stopMock).toBeCalledTimes(1)
  })

  it('should not call stop when the module was not started', async () => {
    // given
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const restifyServerConfig = undefined
    // when
    const webModule = new WebStarter({})
    await webModule.shutdownModule()
    // then
    expect(stopMock).toBeCalledTimes(0)
  })
})

class TestClass {}
