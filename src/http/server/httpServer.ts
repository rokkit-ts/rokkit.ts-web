import {HttpMethods} from "../httpMethods";

export interface HttpServer {
  run(): Promise<void>;
  stop(): Promise<void>;
  addRequestHandler<T>(httpMethod: HttpMethods, requestPath: string, handlerFunction: (...args: any[]) => T): Promise<void>;
}