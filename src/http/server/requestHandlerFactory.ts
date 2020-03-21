import { Next, Request, Response } from 'restify'
import {
  RequestMapping,
  RequestParameter,
  RequestParameterType
} from '../../component/utils'

export class RequestHandlerFactory {
  public static buildHandlerFunction(
    controllerInstance: any,
    requestMapping: RequestMapping
  ): (req: Request, res: Response, next: Next) => any {
    const sortedParameters: any[] = RequestHandlerFactory.sortParameters(
      requestMapping.parameters
    )
    return (req, res, next) => {
      try {
        const requestHandlerArguments = this.buildHttpHandlerParameters(
          req,
          res,
          sortedParameters
        )

        const result = RequestHandlerFactory.callInstanceMethod(
          controllerInstance,
          requestMapping,
          requestHandlerArguments
        )

        if (result) {
          res.send(200, result)
        }
      } catch (error) {
        res.send(500, error)
      }
      return next()
    }
  }

  private static callInstanceMethod(
    controllerInstance: any,
    requestMapping: RequestMapping,
    requestHandlerArguments: any[]
  ) {
    return controllerInstance[requestMapping.methodName](
      ...requestHandlerArguments
    )
  }

  private static sortParameters(
    parameter: RequestParameter[]
  ): RequestParameter[] {
    return parameter.sort((a, b) => {
      if (a.index > b.index) return 1
      if (a.index < b.index) return -1
      return 0
    })
  }

  private static buildHttpHandlerParameters(
    req: Request,
    res: Response,
    parameters: RequestParameter[]
  ): any[] {
    return parameters.map(parameter => {
      switch (parameter.type) {
        case RequestParameterType.BODY:
          return RequestHandlerFactory.parseBody(req.body, parameter.bodyType)
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

  private static parseBody(
    body: string,
    bodyType?: new (...args: any[]) => {}
  ): any {
    if (bodyType) {
      try {
        return Object.assign(new bodyType(), JSON.parse(body))
      } catch (parsingError) {
        throw new Error(`Cannot parse RequestBody --> ${parsingError}`)
      }
    } else {
      try {
        return JSON.parse(body)
      } catch (parsingError) {
        return body
      }
    }
  }
}
