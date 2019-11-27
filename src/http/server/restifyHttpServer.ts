import { createServer, plugins, Server } from "restify";
import { HttpMethods } from "../httpMethods";
import { HttpServer } from "./httpServer";

export class RestifyHttpServer implements HttpServer {
  private static readonly WELCOME_MESSAGE =
    "Restify is now up! Running on port:";
  private static readonly GOODBYE_MESSAGE = "Restify stopped!";
  private readonly restifyInstance: Server;

  constructor() {
    this.restifyInstance = createServer();
    this.restifyInstance.use(plugins.queryParser());
    this.restifyInstance.use(plugins.bodyParser());
  }

  public addRequestHandler<T>(
    httpMethod: HttpMethods,
    requestPath: string,
    handlerFunction: (req: any, res: any) => any
  ): Promise<void> {
    switch (httpMethod) {
      case HttpMethods.GET:
        this.restifyInstance.get(requestPath, handlerFunction);
        break;
      case HttpMethods.POST:
        this.restifyInstance.post(requestPath, handlerFunction);
        break;
      case HttpMethods.PUT:
        this.restifyInstance.put(requestPath, handlerFunction);
        break;
      case HttpMethods.PATCH:
        this.restifyInstance.patch(requestPath, handlerFunction);
        break;
      case HttpMethods.DELETE:
        this.restifyInstance.del(requestPath, handlerFunction);
        break;
      case HttpMethods.OPTIONS:
        this.restifyInstance.opts(requestPath, handlerFunction);
        break;
      case HttpMethods.HEAD:
        this.restifyInstance.head(requestPath, handlerFunction);
        break;
    }

    return Promise.resolve();
  }

  public run(): Promise<void> {
    return this.restifyInstance.listen(8080, () => {
      console.log(RestifyHttpServer.WELCOME_MESSAGE);
      return Promise.resolve();
    });
  }

  public stop(): Promise<void> {
    return this.restifyInstance.close(() => {
      console.log(RestifyHttpServer.GOODBYE_MESSAGE);
      return Promise.resolve();
    });
  }
}
