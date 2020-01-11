import { RequestParameter } from "./util/request/requestParameter";
import { RequestParameterTypes } from "./util/request/requestParameterTypes";

const REQUEST_PARAM_METADATA_SALT = "request-param-";

export function getRequestParameterByFunctionName(
  functionName: string,
  target: object
): RequestParameter[] | undefined {
  return Reflect.getMetadata(
    REQUEST_PARAM_METADATA_SALT + functionName,
    target
  );
}

export function RequestParam(requestParam: string) {
  return function parameterDecoratorFactory(
    target: object,
    propertyKey: string,
    parameterIndex: number
  ) {
    buildMetadataRequestParameter(
      requestParam,
      RequestParameterTypes.REQUEST_PARAMETER,
      target,
      REQUEST_PARAM_METADATA_SALT + propertyKey,
      parameterIndex
    );
  };
}

export function QueryParam(queryParam: string) {
  return function parameterDecoratorFactory(
    target: object,
    propertyKey: string,
    parameterIndex: number
  ) {
    buildMetadataRequestParameter(
      queryParam,
      RequestParameterTypes.QUERY_PARAMETER,
      target,
      REQUEST_PARAM_METADATA_SALT + propertyKey,
      parameterIndex
    );
  };
}

export function RequestBody() {
  return function parameterDecoratorFactory(
    target: object,
    propertyKey: string,
    parameterIndex: number
  ) {
    buildMetadataRequestParameter(
      "",
      RequestParameterTypes.BODY,
      target,
      REQUEST_PARAM_METADATA_SALT + propertyKey,
      parameterIndex
    );
  };
}

export function RequestHeader(header: string) {
  return function parameterDecoratorFactory(
    target: object,
    propertyKey: string,
    parameterIndex: number
  ) {
    buildMetadataRequestParameter(
      header,
      RequestParameterTypes.HEADER,
      target,
      REQUEST_PARAM_METADATA_SALT + propertyKey,
      parameterIndex
    );
  };
}

function buildMetadataRequestParameter(
  key: string,
  decoratorType: RequestParameterTypes,
  target: object,
  propertyKey: string,
  parameterIndex: number
): void {
  const requestParams: RequestParameter[] =
    Reflect.getMetadata(propertyKey, target) || [];
  requestParams.push(
    createRequestParameter(key, parameterIndex, decoratorType)
  );
  Reflect.defineMetadata(propertyKey, requestParams, target);
}

function createRequestParameter(
  key: string,
  index: number,
  type: RequestParameterTypes
): RequestParameter {
  return { key, index, type };
}
