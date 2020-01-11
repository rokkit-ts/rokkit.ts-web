import { Request, Response } from "restify";
import { HttpMethods } from "../httpMethods";

export interface HttpServer {
  run(): Promise<void>;

  stop(): Promise<void>;

  addRequestHandler(
    httpMethod: HttpMethods,
    requestPath: string,
    handlerFunction: (req: Request, res: Response) => any
  ): Promise<void>;
}
