import {HttpMethods} from "../../../http/httpMethods";

export interface RequestMapping {
  httpMethod: HttpMethods;
  resourcePath: string;
  methodName: string;
}