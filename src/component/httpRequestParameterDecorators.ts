import 'reflect-metadata'
import { RequestParameter, RequestParameterType } from './utils'

const REQUEST_PARAM_METADATA_SALT = 'request-param-'

export function getRequestParameterByFunctionName(
  functionName: string,
  target: object
): RequestParameter[] | undefined {
  return Reflect.getMetadata(REQUEST_PARAM_METADATA_SALT + functionName, target)
}

export function RequestPathParameter(requestParam: string) {
  return (target: object, propertyKey: string, parameterIndex: number): void =>
    buildMetadataRequestParameter(
      requestParam,
      RequestParameterType.REQUEST_PATH_PARAMETER,
      target,
      REQUEST_PARAM_METADATA_SALT + propertyKey,
      parameterIndex
    )
}

export function RequestQueryParameter(queryParam: string) {
  return (target: object, propertyKey: string, parameterIndex: number): void =>
    buildMetadataRequestParameter(
      queryParam,
      RequestParameterType.REQUEST_QUERY_PARAMETER,
      target,
      REQUEST_PARAM_METADATA_SALT + propertyKey,
      parameterIndex
    )
}

export function RequestHeader(header: string) {
  return (target: object, propertyKey: string, parameterIndex: number): void =>
    buildMetadataRequestParameter(
      header,
      RequestParameterType.HEADER,
      target,
      REQUEST_PARAM_METADATA_SALT + propertyKey,
      parameterIndex
    )
}

export function RequestBody<T extends new (...args: any[]) => {}>(
  bodyType?: T
) {
  return (target: object, propertyKey: string, parameterIndex: number): void =>
    buildMetadataRequestParameter(
      '',
      RequestParameterType.BODY,
      target,
      REQUEST_PARAM_METADATA_SALT + propertyKey,
      parameterIndex,
      bodyType
    )
}

export function Request() {
  return (target: object, propertyKey: string, parameterIndex: number): void =>
    buildMetadataRequestParameter(
      '',
      RequestParameterType.REQUEST,
      target,
      REQUEST_PARAM_METADATA_SALT + propertyKey,
      parameterIndex
    )
}

export function Response() {
  return (target: object, propertyKey: string, parameterIndex: number): void =>
    buildMetadataRequestParameter(
      '',
      RequestParameterType.RESPONSE,
      target,
      REQUEST_PARAM_METADATA_SALT + propertyKey,
      parameterIndex
    )
}

function buildMetadataRequestParameter(
  key: string,
  decoratorType: RequestParameterType,
  target: object,
  propertyKey: string,
  parameterIndex: number,
  bodyType?: new (...args: any[]) => {}
): void {
  const requestParams: RequestParameter[] =
    Reflect.getMetadata(propertyKey, target) || []
  requestParams.push(
    createRequestParameter(key, parameterIndex, decoratorType, bodyType)
  )
  Reflect.defineMetadata(propertyKey, requestParams, target)
}

function createRequestParameter(
  key: string,
  index: number,
  type: RequestParameterType,
  bodyType?: new (...args: any[]) => {}
): RequestParameter {
  return { key, index, type, bodyType }
}
