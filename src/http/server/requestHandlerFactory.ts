import { RequestMapping } from "../../component/util/request/requestMapping";
import { RequestParameter } from "../../component/util/request/requestParameter";
import { RequestParameterTypes } from "../../component/util/request/requestParameterTypes";

export class RequestHandlerFactory {
  constructor() {}

  buildHandlerFunction(
    controllerInstance: any,
    requestMapping: RequestMapping
  ): (req: any, res: any) => any {
    const sortedParameters: any[] = this.sortParameters(
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

  private static callInstanceMethod(
    controllerInstance: any,
    requestMapping: RequestMapping,
    requestHandlerArguments: any[]
  ) {
    return controllerInstance[requestMapping.methodName](
      ...requestHandlerArguments
    );
  }

  private buildHttpHandlerParameters(
    req: any,
    parameter: RequestParameter[]
  ): any[] {
    return parameter.map(parameter => {
      if (parameter.type === RequestParameterTypes.BODY) return req.body;
      if (parameter.type === RequestParameterTypes.REQUEST_PARAMETER) {
        return req.params[parameter.key];
      }
      if (parameter.type === RequestParameterTypes.QUERY_PARAMETER) {
        return req.query[parameter.key];
      }
      if (parameter.type === RequestParameterTypes.HEADER) {
        return req.headers[parameter.key];
      }
    });
  }

  private sortParameters(parameter: RequestParameter[]): RequestParameter[] {
    return parameter.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    });
  }
}
