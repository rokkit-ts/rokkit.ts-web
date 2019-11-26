export interface HttpServer {
  run(): Promise<void>;
  stop(): Promise<void>;
  addRequestHandler<T>(handlerFunction: (...args: any[]) => T): Promise<void>;
}