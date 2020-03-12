import { HttpMethod } from '../../../http'
import { RequestParameter } from './requestParameter'

export interface RequestMapping {
  httpMethod: HttpMethod
  resourcePath: string
  methodName: string
  parameters: RequestParameter[]
}
