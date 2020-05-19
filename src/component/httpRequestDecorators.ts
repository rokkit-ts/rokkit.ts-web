import 'reflect-metadata'
import { HttpMethod } from '../http/'
import { getRequestParameterByFunctionName } from './httpRequestParameterDecorators'
import { METADATA_KEY_RESOURCE_MAPPINGS, RequestMapping } from './utils'

export function Get(resourcePath: string): Function {
  return buildHTTPFunctionDecorator(HttpMethod.GET, resourcePath)
}

export function Post(resourcePath: string): Function {
  return buildHTTPFunctionDecorator(HttpMethod.POST, resourcePath)
}

export function Put(resourcePath: string): Function {
  return buildHTTPFunctionDecorator(HttpMethod.PUT, resourcePath)
}

export function Patch(resourcePath: string): Function {
  return buildHTTPFunctionDecorator(HttpMethod.PATCH, resourcePath)
}

export function Delete(resourcePath: string): Function {
  return buildHTTPFunctionDecorator(HttpMethod.DELETE, resourcePath)
}

export function Head(resourcePath: string): Function {
  return buildHTTPFunctionDecorator(HttpMethod.HEAD, resourcePath)
}

export function Options(resourcePath: string): Function {
  return buildHTTPFunctionDecorator(HttpMethod.OPTIONS, resourcePath)
}

export function getRequestMappings<T extends new (...args: any) => {}>(
  constructor: T
): RequestMapping[] | undefined {
  return Reflect.getMetadata(METADATA_KEY_RESOURCE_MAPPINGS, constructor)
}

function buildHTTPFunctionDecorator(
  httpMethod: HttpMethod,
  resourcePath: string
): Function {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (target: object, propertyKey: string, _: PropertyDescriptor): void => {
    const resourceMapping = buildResourceMapping(
      httpMethod,
      propertyKey,
      resourcePath,
      target
    )
    const resourceMappings = getResourceMappings(target) || []
    resourceMappings.push(resourceMapping)
    setResourceMappings(resourceMappings, target)
  }
}

function buildResourceMapping(
  httpMethod: HttpMethod,
  propertyKey: string,
  resourcePath: string,
  target: object
): RequestMapping {
  const resourceMapping: RequestMapping = {
    httpMethod,
    methodName: propertyKey,
    parameters: getRequestParameterByFunctionName(propertyKey, target) || [],
    resourcePath
  }
  return resourceMapping
}

function getResourceMappings(target: object): RequestMapping[] | undefined {
  return Reflect.getOwnMetadata(
    METADATA_KEY_RESOURCE_MAPPINGS,
    target.constructor
  )
}

function setResourceMappings(
  resourceMappings: RequestMapping[],
  target: object
): void {
  Reflect.defineMetadata(
    METADATA_KEY_RESOURCE_MAPPINGS,
    resourceMappings,
    target.constructor
  )
}
