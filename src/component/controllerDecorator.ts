import { Injectable } from "@rokkit.ts/dependency-injection";
import { addHttpController } from "../starter";
import { getRequestMappings } from "./httpRequestDecorators";

export function Controller(
  resourcePath: string,
  fileName?: string,
  contextName?: string
): Function {
  return <T extends new (...args: any[]) => {}>(constructor: T) => {
    Injectable(fileName, contextName)(constructor);
    addHttpController(createControllerInformation(constructor, resourcePath));
  };
}

function createControllerInformation<T extends new (...args: any[]) => {}>(
  constructor: T,
  resourcePath: string
) {
  return {
    basePath: resourcePath,
    controllerName: constructor.name,
    resourceMappings: getRequestMappings(constructor) || []
  };
}
