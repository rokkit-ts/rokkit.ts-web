import { Next, Request, Response } from 'restify'
import {
  RequestMapping,
  RequestParameter,
  RequestParameterType
} from '../../component/utils'
import { ObjectMapper } from '../objectMapper/ObjectMapper'

export class RequestHandlerFactory {
  private readonly objectMapper: ObjectMapper

  constructor(objectMapper: ObjectMapper) {
    this.objectMapper = objectMapper
  }

  public buildHandlerFunction(
    controllerInstance: any,
    requestMapping: RequestMapping
  ): (req: Request, res: Response, next: Next) => any {
    const sortedParameters: any[] = this.sortParameters(
      requestMapping.parameters
    )
    return (req, res, next) => {
      try {
        const requestHandlerArguments = this.buildHttpHandlerParameters(
          req,
          res,
          sortedParameters
        )

        const result = this.callInstanceMethod(
          controllerInstance,
          requestMapping,
          requestHandlerArguments
        )

        if (result) {
          if (this.instanceOfResponse(result) && result.finished) {
            return
          }
          res.send(200, result)
        } else {
          throw new Error(
            'Request handler completed with undefined --> most likely the function returns nothing'
          )
        }
      } catch (error) {
        res.send(500, error.message)
      }
      return next()
    }
  }

  private callInstanceMethod(
    controllerInstance: any,
    requestMapping: RequestMapping,
    requestHandlerArguments: any[]
  ) {
    return controllerInstance[requestMapping.methodName](
      ...requestHandlerArguments
    )
  }

  private sortParameters(parameter: RequestParameter[]): RequestParameter[] {
    return parameter.sort((a, b) => {
      if (a.index > b.index) return 1
      if (a.index < b.index) return -1
      return 0
    })
  }

  private buildHttpHandlerParameters(
    req: Request,
    res: Response,
    parameters: RequestParameter[]
  ): any[] {
    return parameters.map(parameter => {
      switch (parameter.type) {
        case RequestParameterType.BODY:
          return this.parseBody(req.body, parameter.bodyType)
        case RequestParameterType.REQUEST:
          return req
        case RequestParameterType.RESPONSE:
          return res
        case RequestParameterType.REQUEST_PATH_PARAMETER:
          return req.params[parameter.key]
        case RequestParameterType.REQUEST_QUERY_PARAMETER:
          return req.query[parameter.key]
        case RequestParameterType.HEADER:
          return req.headers[parameter.key]
      }
    })
  }

  private parseBody<T>(body: string, bodyType?: new (...args: any[]) => T): T {
    return typeof body === 'string'
      ? this.objectMapper.parseTo(body, bodyType)
      : body
  }

  private instanceOfResponse(object: any): object is Response {
    return (
      typeof object === 'object' &&
      'finished' in object &&
      'send' in object &&
      '_headerSent' in object &&
      '_hasBody' in object
    )
  }
}
