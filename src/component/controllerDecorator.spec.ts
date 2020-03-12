// tslint:disable:max-classes-per-file
// tslint:disable:no-unused-expression

const registerHttpControllerMock = jest.fn()

jest.mock('../starter', () => ({
  registerHttpController: registerHttpControllerMock
}))

const injectableMock = jest.fn()
injectableMock.mockReturnValue(jest.fn)
jest.mock('@rokkit.ts/dependency-injection', () => ({
  Injectable: injectableMock
}))

import { HttpMethod } from '../http'
import { Controller } from './controllerDecorator'
import { Post } from './httpRequestDecorators'
import { RequestBody } from './httpRequestParameterDecorators'
import { ControllerInformation } from './util/controllerInformation'
import { RequestParameterType } from './util/request/requestParameterType'
describe('ControllerDecorator', () => {
  it('should register a controller at the WebStarter', () => {
    // given/when
    const expectedController: ControllerInformation = {
      basePath: '/hello',
      controllerName: 'TestControllerClass',
      resourceMappings: [
        {
          httpMethod: HttpMethod.POST,
          methodName: 'postMethod',
          parameters: [{ index: 0, key: '', type: RequestParameterType.BODY }],
          resourcePath: '/world'
        }
      ]
    }
    // then
    expect(registerHttpControllerMock).toHaveBeenCalledTimes(1)
    expect(registerHttpControllerMock).toHaveBeenCalledWith(expectedController)
  })

  it('should register an inject in the dependency injector context', () => {
    expect(injectableMock).toBeCalledTimes(1)
    expect(injectableMock).toBeCalledWith(__filename, 'contextName')
  })
})

@Controller('/hello', __filename, 'contextName')
class TestControllerClass {
  @Post('/world')
  // tslint:disable-next-line:no-empty
  public postMethod(@RequestBody() body: any) {}
}
