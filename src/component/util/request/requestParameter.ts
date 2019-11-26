import {RequestParameterTypes} from "./requestParameterTypes";

export interface RequestParameter {
  index: number;
  key: string;
  type: RequestParameterTypes;
}