import { Request, Response } from "restify";
import { HttpMethod } from "../httpMethod";

export interface HttpServer {
  run(): Promise<void>;

  stop(): Promise<void>;

  addRequestHandler(
    httpMethod: HttpMethod,
    requestPath: string,
    handlerFunction: (req: Request, res: Response) => any
  ): Promise<void>;
}
