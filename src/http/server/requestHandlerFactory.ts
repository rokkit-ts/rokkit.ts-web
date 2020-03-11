import { Next, Request, Response } from 'restify'
import { RequestMapping } from '../../component/util/request/requestMapping'
import { RequestParameter } from '../../component/util/request/requestParameter'
import { RequestParameterType } from '../../component/util/request/requestParameterType'

export class RequestHandlerFactory {
  public static buildHandlerFunction(
    controllerInstance: any,
    requestMapping: RequestMapping
  ): (req: Request, res: Response, next: Next) => any {
    const sortedParameters: any[] = RequestHandlerFactory.sortParameters(
      requestMapping.parameters
    )
    return (req, res, next) => {
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
          return req.body
        case RequestParameterType.REQUEST:
          return req
        case RequestParameterType.RESPONSE:
          return res
        case RequestParameterType.REQUEST_PARAMETER:
          return req.params[parameter.key]
        case RequestParameterType.QUERY_PARAMETER:
          return req.query[parameter.key]
        case RequestParameterType.HEADER:
          return req.headers[parameter.key]
      }
    })
  }
}
