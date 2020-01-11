import { HttpMethods } from "../http/";
import { getRequestParameterByFunctionName } from "./httpRequestParameterDecorators";
import { METADATA_KEY_RESOURCE_MAPPINGS } from "./util/decoratorConstants";
import { RequestMapping } from "./util/request/requestMapping";

export function Get(resourcePath: string) {
  return buildHTTPFunctionDecorator(HttpMethods.GET, resourcePath);
}

export function Post(resourcePath: string) {
  return buildHTTPFunctionDecorator(HttpMethods.POST, resourcePath);
}

export function Put(resourcePath: string) {
  return buildHTTPFunctionDecorator(HttpMethods.PUT, resourcePath);
}

export function Patch(resourcePath: string) {
  return buildHTTPFunctionDecorator(HttpMethods.PATCH, resourcePath);
}

export function Delete(resourcePath: string) {
  return buildHTTPFunctionDecorator(HttpMethods.DELETE, resourcePath);
}

export function Head(resourcePath: string) {
  return buildHTTPFunctionDecorator(HttpMethods.HEAD, resourcePath);
}

export function Options(resourcePath: string) {
  return buildHTTPFunctionDecorator(HttpMethods.OPTIONS, resourcePath);
}

export function getRequestMappings<T extends new (...args: any) => {}>(
  constructor: T
): RequestMapping[] | undefined {
  return Reflect.getMetadata(METADATA_KEY_RESOURCE_MAPPINGS, constructor);
}

function buildHTTPFunctionDecorator(
  httpMethod: HttpMethods,
  resourcePath: string
): Function {
  return (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const resourceMapping = buildResourceMapping(
      httpMethod,
      propertyKey,
      resourcePath,
      target
    );
    const resourceMappings = getResourceMappings(target) || [];
    resourceMappings.push(resourceMapping);
    setResourceMappings(resourceMappings, target);
  };
}

function buildResourceMapping(
  httpMethod: HttpMethods,
  propertyKey: string,
  resourcePath: string,
  target: object
) {
  const resourceMapping: RequestMapping = {
    httpMethod,
    methodName: propertyKey,
    parameters: getRequestParameterByFunctionName(propertyKey, target) || [],
    resourcePath
  };
  return resourceMapping;
}

function getResourceMappings(target: object): RequestMapping[] | undefined {
  return Reflect.getOwnMetadata(
    METADATA_KEY_RESOURCE_MAPPINGS,
    target.constructor
  );
}

function setResourceMappings(
  resourceMappings: RequestMapping[],
  target: object
) {
  Reflect.defineMetadata(
    METADATA_KEY_RESOURCE_MAPPINGS,
    resourceMappings,
    target.constructor
  );
}
