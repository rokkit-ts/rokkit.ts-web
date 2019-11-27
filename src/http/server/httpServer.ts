import { HttpMethods } from "../httpMethods";

export interface HttpServer {
  run(): Promise<void>;

  stop(): Promise<void>;

  addRequestHandler(
    httpMethod: HttpMethods,
    requestPath: string,
    handlerFunction: (req: any, res: any) => any
  ): Promise<void>;
}
