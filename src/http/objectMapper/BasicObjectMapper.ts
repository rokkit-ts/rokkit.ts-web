import { ObjectMapper } from './ObjectMapper'

export class BasicObjectMapper extends ObjectMapper {
  public parseTo<T>(data: string, type?: new (...args: any[]) => T): T {
    let jsonData: unknown
    try {
      jsonData = JSON.parse(data, (_: string, value: unknown) =>
        this.basicReviver(value)
      )
    } catch (error) {
      throw new Error(`Not able to parse data to JSON: ${error.message}`)
    }

    if (type) {
      return Object.assign(new type(), jsonData)
    } else {
      return jsonData as T
    }
  }

  private basicReviver(value: unknown): unknown {
    if (this.config.shouldParseDates) {
      if (typeof value === 'string' && this.config.dateFormat.test(value)) {
        const newDate = new Date(value)
        if (isNaN(newDate.valueOf())) {
          throw new Error('Date is not valid')
        }
        return newDate
      }
    }
    return value
  }
}
