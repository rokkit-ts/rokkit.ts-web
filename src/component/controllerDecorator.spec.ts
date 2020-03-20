// tslint:disable:max-classes-per-file
// tslint:disable:no-unused-expression

import { HttpMethod } from '../http'
import { Controller } from './controllerDecorator'
import { Post } from './httpRequestDecorators'
import { RequestBody } from './httpRequestParameterDecorators'
import { ControllerInformation, RequestParameterType } from './utils'
import { registerHttpController } from '../starter'
import { Injectable } from '@rokkit.ts/dependency-injection'

jest.mock('../starter')
jest.mock('@rokkit.ts/dependency-injection', () => ({
  Injectable: jest.fn().mockReturnValue(jest.fn)
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

  it('should register an inject in the dependency injector context', () => {
    expect(Injectable).toBeCalledTimes(1)
    expect(Injectable).toBeCalledWith(__filename, 'contextName')
  })
})

@Controller('/hello', __filename, 'contextName')
class TestControllerClass {
  @Post('/world')
  // tslint:disable-next-line:no-empty
  public postMethod(@RequestBody() body: any) {}
}
