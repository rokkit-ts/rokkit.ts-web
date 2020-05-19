import { RokkitDI } from '@rokkit.ts/dependency-injection'
import { registerHttpController } from '../starter'
import { getRequestMappings } from './httpRequestDecorators'
import { ControllerInformation } from './utils'

export function Controller(resourcePath: string): Function {
  return <T extends new (...args: any[]) => {}>(constructor: T): T => {
    RokkitDI.registerInjectable(constructor)
    registerHttpController(
      createControllerInformation(constructor, resourcePath)
    )
    return class extends constructor {}
  }
}

function createControllerInformation<T extends new (...args: any[]) => {}>(
  constructor: T,
  resourcePath: string
): ControllerInformation {
  return {
    basePath: resourcePath,
    controllerName: constructor.name,
    resourceMappings: getRequestMappings(constructor) || []
  }
}
