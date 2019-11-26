import {HttpServer} from "./httpServer";
import {Server, createServer} from "restify";
import {HttpMethods} from "../httpMethods";

export class RestifyHttpServer implements HttpServer{

  private readonly restifyInstance: Server;

  constructor(){
    this.restifyInstance = createServer();
  }

  addRequestHandler<T>(httpMethod: HttpMethods, requestPath: string, handlerFunction: (...args: any[]) => T): Promise<void> {

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

  run(): Promise<void> {
    return this.restifyInstance.listen(8080, function () {
      console.log("Restify running");
      return Promise.resolve();
    });
  }

  stop(): Promise<void> {
    return this.restifyInstance.close(function () {
      console.log("Restify stopped");
      return Promise.resolve();
    })
  }

}