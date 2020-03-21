import { RequestParameterType } from './requestParameterType'

export interface RequestParameter {
  index: number
  key: string
  type: RequestParameterType
  bodyType?: new (...args: any[]) => {}
}
