import {
  createServer,
  Next,
  plugins,
  Request,
  Response,
  Server,
  ServerOptions
} from 'restify'
import { HttpMethod } from '../httpMethod'
import { HttpServer } from './httpServer'
import Logger, { createLogger } from 'bunyan'

export type RokkitServerOptions = ServerOptions & { port?: number }

const DEFAULT_PORT = 8080
const DEFAULT_LOGGER = createLogger({ name: 'Rokkit.ts WebServer' })
const DEFAULT_CONFIGURATION: RokkitServerOptions = {
  port: DEFAULT_PORT,
  log: DEFAULT_LOGGER,
  ignoreTrailingSlash: false
}

export class RestifyHttpServer implements HttpServer {
  private static readonly WELCOME_MESSAGE = 'Restify is now running!'
  private static readonly GOODBYE_MESSAGE = 'Restify stopped!'
  private readonly restifyInstance: Server
  private readonly port: number
  private readonly logger: Logger

  public constructor(
    severConfiguration: RokkitServerOptions = DEFAULT_CONFIGURATION
  ) {
    this.restifyInstance = this.create(severConfiguration)
    this.port = severConfiguration.port ?? DEFAULT_PORT
    this.logger = severConfiguration.log ?? DEFAULT_LOGGER
  }

  public addRequestHandler<T>(
    httpMethod: HttpMethod,
    requestPath: string,
    handlerFunction: (req: Request, res: Response, next: Next) => any
  ): Promise<void> {
    switch (httpMethod) {
      case HttpMethod.GET:
        this.restifyInstance.get(requestPath, handlerFunction)
        break
      case HttpMethod.POST:
        this.restifyInstance.post(requestPath, handlerFunction)
        break
      case HttpMethod.PUT:
        this.restifyInstance.put(requestPath, handlerFunction)
        break
      case HttpMethod.PATCH:
        this.restifyInstance.patch(requestPath, handlerFunction)
        break
      case HttpMethod.DELETE:
        this.restifyInstance.del(requestPath, handlerFunction)
        break
      case HttpMethod.OPTIONS:
        this.restifyInstance.opts(requestPath, handlerFunction)
        break
      case HttpMethod.HEAD:
        this.restifyInstance.head(requestPath, handlerFunction)
        break
    }

    return Promise.resolve()
  }

  public run(): Promise<void> {
    return this.restifyInstance.listen(this.port, () => {
      this.logger.info(RestifyHttpServer.WELCOME_MESSAGE)
      Promise.resolve()
    })
  }

  public stop(): Promise<void> {
    return this.restifyInstance.close(() => {
      this.logger.info(RestifyHttpServer.GOODBYE_MESSAGE)
      Promise.resolve()
    })
  }

  private create(severConfiguration: ServerOptions): Server {
    const server = createServer(severConfiguration)
    server.use(plugins.queryParser())
    server.use(plugins.bodyParser())
    return server
  }
}
