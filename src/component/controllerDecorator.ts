import {Injectable} from "@rokkit.ts/dependency-injection";

export function Controller(resourcePath: string, fileName?: string, contextName?: string): Function {
  return <T extends new (...args: any[]) => {}>(constructor: T) =>{
    // register injector
    Injectable(fileName, contextName)(constructor);
    // TODO scan class meta for request functions!

  }
}