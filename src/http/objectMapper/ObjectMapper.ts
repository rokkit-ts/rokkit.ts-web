export interface ObjectMapperConfig {
  shouldParseDates?: boolean
  dateFormat?: RegExp
}

export abstract class ObjectMapper {
  /**
   * RegExp to test a string for a full ISO 8601 Date
   *  YYYY-MM-DDThh:mm:ss
   *  YYYY-MM-DDThh:mm:ssTZD
   *  YYYY-MM-DDThh:mm:ss.sTZD
   * @see: https://www.w3.org/TR/NOTE-datetime
   * @type {RegExp}
   */
  private static readonly iso8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i
  protected config: Required<ObjectMapperConfig>

  constructor(config?: ObjectMapperConfig) {
    this.config = {
      dateFormat: config?.dateFormat ?? ObjectMapper.iso8601,
      shouldParseDates: config?.shouldParseDates ?? true
    }
  }
  public abstract parseTo<T>(data: string, type: new (...args: any[]) => T): T
}
