import { HttpMethods } from "../../../http";
import { RequestParameter } from "./requestParameter";

export interface RequestMapping {
  httpMethod: HttpMethods;
  resourcePath: string;
  methodName: string;
  parameters: RequestParameter[];
}
