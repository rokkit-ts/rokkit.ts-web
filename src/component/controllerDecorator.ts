import { RokkitDI } from '@rokkit.ts/dependency-injection'
import { registerHttpController } from '../starter'
import { getRequestMappings } from './httpRequestDecorators'

export function Controller(resourcePath: string): Function {
  return <T extends new (...args: any[]) => {}>(constructor: T) => {
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
) {
  return {
    basePath: resourcePath,
    controllerName: constructor.name,
    resourceMappings: getRequestMappings(constructor) || []
  }
}
