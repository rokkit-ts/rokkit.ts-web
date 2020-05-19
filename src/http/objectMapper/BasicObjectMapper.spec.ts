/* eslint-disable max-classes-per-file */
import { BasicObjectMapper } from './BasicObjectMapper'

describe('BasicObjectMapper', () => {
  it('should parse string to a simple class', () => {
    // given
    const stringData =
      '{ "aString": "aSimpleString", "aNumber": 1.12345, "aBoolean": false, "anArrayOfStrings": [ "an", "array"] }'
    const expectedClass = new SimpleClass('aSimpleString', 1.12345, false, [
      'an',
      'array'
    ])

    // when
    const objectMapper = new BasicObjectMapper()
    const actualClass = objectMapper.parseTo(stringData, SimpleClass)

    // then
    expect(actualClass).toEqual(expectedClass)
  })

  it('should parse string to class with nested classes', () => {
    // given
    const stringData =
      '{ "simpleClass" : { "aString": "aSimpleString", "aNumber": 1.12345, "aBoolean": false, "anArrayOfStrings": [ "an", "array"] }, "anInterface": { "aString": "aSimpleString"}}'
    const expectedClass = new ComplexClass(
      new SimpleClass('aSimpleString', 1.12345, false, ['an', 'array']),
      { aString: 'aSimpleString' }
    )

    // when
    const objectMapper = new BasicObjectMapper()
    const actualClass = objectMapper.parseTo(stringData, ComplexClass)

    // then
    expect(actualClass).toEqual(expectedClass)
  })

  it('should parse string that contains iso 8601 conforming date (2020-02-01T00:00:00.000Z) to class with date', () => {
    // given
    const stringData = '{ "date": "2020-02-01T00:00:00.000Z" }'
    const expectedClass = new ClassWithDate(
      new Date('2020-02-01T00:00:00.000Z')
    )

    // when
    const objectMapper = new BasicObjectMapper()
    const actualClass = objectMapper.parseTo(stringData, ClassWithDate)

    // then
    expect(actualClass).toEqual(expectedClass)
  })

  it('should parse string that contains iso 8601 conforming date (2020-02-01T01:00:00+01:00) to class with date', () => {
    // given
    const stringData = '{ "date": "2020-02-01T01:00:00.000+01:00" }'
    const expectedClass = new ClassWithDate(new Date('2020-02-01'))

    // when
    const objectMapper = new BasicObjectMapper()
    const actualClass = objectMapper.parseTo(stringData, ClassWithDate)

    // then
    expect(actualClass).toEqual(expectedClass)
  })

  it('should parse string that contains date conforming the given format', () => {
    // given
    const stringData = '{ "date": "2020-02-01" }'
    const expectedClass = new ClassWithDate(new Date('2020-02-01'))

    // when
    const objectMapper = new BasicObjectMapper({
      dateFormat: /^\d{4}\-\d{2}\-\d{2}/
    })
    const actualClass = objectMapper.parseTo(stringData, ClassWithDate)

    // then
    expect(actualClass).toEqual(expectedClass)
  })

  it('should parse throw exception if a given date is not assignable to date class', () => {
    // given
    const stringData = '{ "date": "2020-99-01T01:00:00.000+01:00" }'
    const objectMapper = new BasicObjectMapper()

    // when / then
    expect(() => objectMapper.parseTo(stringData, ClassWithDate)).toThrowError(
      'Date is not valid'
    )
  })

  it('should throw exception if the json string is not parseable', () => {
    // given
    const stringData = '{ "date": -as"2020-99-01T01:00:00.000+01:00" }'
    const objectMapper = new BasicObjectMapper()
    // when /then
    expect(() => objectMapper.parseTo(stringData, ClassWithDate)).toThrowError(
      'Not able to parse data to JSON'
    )
  })

  it('should parse date as string when configured to nopt parse dates', () => {
    // given
    const stringData = '{ "date": "2020-99-01T01:00:00.000+01:00" }'
    const shouldParseDates = false
    // when
    const objectMapper = new BasicObjectMapper({
      shouldParseDates
    })
    const actualClass = objectMapper.parseTo(stringData, ClassWithDateAsString)
    // then
    expect(actualClass).toEqual(
      new ClassWithDateAsString('2020-99-01T01:00:00.000+01:00')
    )
  })

  it('should pasre data to interface', () => {
    // given
    const stringData = '{ "aString": "test"}'
    const expectedInterface = { aString: 'test' }
    const objectMapper = new BasicObjectMapper()
    // when
    const actualInterface = objectMapper.parseTo<AnInterface>(stringData)
    // then
    expect(actualInterface).toEqual(expectedInterface)
  })
})

interface AnInterface {
  aString: string
}
class SimpleClass {
  public constructor(
    public aString: string,
    public aNumber: number,
    public aBoolean: boolean,
    public anArrayOfStrings: string[]
  ) {}
}

class ComplexClass {
  public constructor(
    public simpleClass: SimpleClass,
    public anInterface: { aString: string }
  ) {}
}

class ClassWithDate {
  public constructor(public date: Date) {}
}

class ClassWithDateAsString {
  public constructor(public date: string) {}
}
