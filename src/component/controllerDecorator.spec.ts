// eslint-disable max-classes-per-file
// eslint-disable @typescript-eslint/no-unused-expressions

import { HttpMethod } from '../http'
import { Controller } from './controllerDecorator'
import { Post } from './httpRequestDecorators'
import { RequestBody } from './httpRequestParameterDecorators'
import { ControllerInformation, RequestParameterType } from './utils'
import { registerHttpController } from '../starter'

jest.mock('../starter')
jest.mock('@rokkit.ts/dependency-injection', () => ({
  RokkitDI: { registerInjectable: jest.fn() }
}))

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
    expect(registerHttpController).toHaveBeenCalledTimes(1)
    expect(registerHttpController).toHaveBeenCalledWith(expectedController)
  })
})

@Controller('/hello')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TestControllerClass {
  @Post('/world')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public postMethod(@RequestBody() body: unknown): void {}
}
