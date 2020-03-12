import { RequestMapping } from './request/requestMapping'

export interface ControllerInformation {
  basePath: string | undefined
  controllerName: string
  resourceMappings: RequestMapping[]
}
