import { Request, Response } from "restify";
import { RequestMapping } from "../../component/util/request/requestMapping";
import { RequestParameter } from "../../component/util/request/requestParameter";
import { RequestParameterType } from "../../component/util/request/requestParameterType";

export class RequestHandlerFactory {
  private static callInstanceMethod(
    controllerInstance: any,
    requestMapping: RequestMapping,
    requestHandlerArguments: any[]
  ) {
    return controllerInstance[requestMapping.methodName](
      ...requestHandlerArguments
    );
  }

  private static sortParameters(
    parameter: RequestParameter[]
  ): RequestParameter[] {
    return parameter.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    });
  }

  public buildHandlerFunction(
    controllerInstance: any,
    requestMapping: RequestMapping
  ): (req: Request, res: Response) => any {
    const sortedParameters: any[] = RequestHandlerFactory.sortParameters(
      requestMapping.parameters
    );
    return (req, res) => {
      const requestHandlerArguments = this.buildHttpHandlerParameters(
        req,
        sortedParameters
      );
      const result = RequestHandlerFactory.callInstanceMethod(
        controllerInstance,
        requestMapping,
        requestHandlerArguments
      );
      res.send(result);
    };
  }

  private buildHttpHandlerParameters(
    req: Request,
    parameters: RequestParameter[]
  ): any[] {
    return parameters.map(parameter => {
      if (parameter.type === RequestParameterType.BODY) return req.body;
      if (parameter.type === RequestParameterType.REQUEST_PARAMETER) {
        return req.params[parameter.key];
      }
      if (parameter.type === RequestParameterType.QUERY_PARAMETER) {
        return req.query[parameter.key];
      }
      if (parameter.type === RequestParameterType.HEADER) {
        return req.headers[parameter.key];
      }
    });
  }
}
