import "reflect-metadata";
import { RequestParameter } from "./util/request/requestParameter";
import { RequestParameterType } from "./util/request/requestParameterType";

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
      RequestParameterType.REQUEST_PARAMETER,
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
      RequestParameterType.QUERY_PARAMETER,
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
      RequestParameterType.BODY,
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
      RequestParameterType.HEADER,
      target,
      REQUEST_PARAM_METADATA_SALT + propertyKey,
      parameterIndex
    );
  };
}

function buildMetadataRequestParameter(
  key: string,
  decoratorType: RequestParameterType,
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
  type: RequestParameterType
): RequestParameter {
  return { key, index, type };
}
