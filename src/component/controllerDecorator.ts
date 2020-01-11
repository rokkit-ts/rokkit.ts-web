import { Injectable } from "@rokkit.ts/dependency-injection";
import { registerHttpController } from "../starter";
import { getRequestMappings } from "./httpRequestDecorators";

export function Controller(
  resourcePath: string,
  fileName?: string,
  contextName?: string
): Function {
  return <T extends new (...args: any[]) => {}>(constructor: T) => {
    Injectable(fileName, contextName)(constructor);
    registerHttpController(
      createControllerInformation(constructor, resourcePath)
    );
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
