import {HttpMethods} from "../http/httpMethods";
import {RequestMapping} from "./util/request/requestMapping";
import {METADATA_KEY_RESOURCE_MAPPINGS} from "./util/decoratorConstants";

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

function buildHTTPFunctionDecorator(
    httpMethod: HttpMethods,
    resourcePath: string
): Function {
  return (
      target: Object,
      propertyKey: string,
      descriptor: PropertyDescriptor
  ) => {
    const resourceMapping = buildResourceMapping(httpMethod, propertyKey, resourcePath);
    let resourceMappings = getResourceMappings(target) || [];
    resourceMappings.push(resourceMapping);
    setResourceMappings(resourceMappings, target);
  };
}

function buildResourceMapping(httpMethod: HttpMethods, propertyKey: string, resourcePath: string) {
  const resourceMapping: RequestMapping = {
    httpMethod: httpMethod,
    methodName: propertyKey,
    resourcePath: resourcePath
  };
  return resourceMapping;
}

function getResourceMappings(target: Object): RequestMapping[] | undefined {
  return  Reflect.getOwnMetadata(
      METADATA_KEY_RESOURCE_MAPPINGS,
      target.constructor
  );
}

function setResourceMappings(resourceMappings: RequestMapping[], target: Object) {
  Reflect.defineMetadata(
      METADATA_KEY_RESOURCE_MAPPINGS,
      resourceMappings,
      target.constructor
  );
}
