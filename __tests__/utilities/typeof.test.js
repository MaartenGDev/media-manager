import { isString } from '../../src/utilities/typeof'

test('isString should return true for a string', () => {

  expect(isString('hello world')).toEqual(true)
})

test('isString should return true for an object', () => {

  expect(isString({})).toEqual(false)
})

test('isString should return true for an array', () => {

  expect(isString([])).toEqual(false)
})
