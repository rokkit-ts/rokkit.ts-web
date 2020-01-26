import {
  createServer,
  Next,
  plugins,
  Request,
  Response,
  Server
} from "restify";
import { HttpMethod } from "../httpMethod";
import { HttpServer } from "./httpServer";

export class RestifyHttpServer implements HttpServer {
  private static readonly WELCOME_MESSAGE =
    "Restify is now up! Running on port:";
  private static readonly GOODBYE_MESSAGE = "Restify stopped!";
  private readonly restifyInstance: Server;

  // TODO: consume options parameter to configure the restify instance.
  constructor() {
    this.restifyInstance = createServer();
    this.restifyInstance.use(plugins.queryParser());
    this.restifyInstance.use(plugins.bodyParser());
  }

  public addRequestHandler<T>(
    httpMethod: HttpMethod,
    requestPath: string,
    handlerFunction: (req: Request, res: Response, next: Next) => any
  ): Promise<void> {
    switch (httpMethod) {
      case HttpMethod.GET:
        this.restifyInstance.get(requestPath, handlerFunction);
        break;
      case HttpMethod.POST:
        this.restifyInstance.post(requestPath, handlerFunction);
        break;
      case HttpMethod.PUT:
        this.restifyInstance.put(requestPath, handlerFunction);
        break;
      case HttpMethod.PATCH:
        this.restifyInstance.patch(requestPath, handlerFunction);
        break;
      case HttpMethod.DELETE:
        this.restifyInstance.del(requestPath, handlerFunction);
        break;
      case HttpMethod.OPTIONS:
        this.restifyInstance.opts(requestPath, handlerFunction);
        break;
      case HttpMethod.HEAD:
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
