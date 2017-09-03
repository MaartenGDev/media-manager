import { toArray } from '../../src/utilities/array'

test('a string should be converted to an array containing the one string', () => {

  expect(toArray('hello world')).toEqual(['hello world'])
})

test('an array should return the original array', () => {

  expect(toArray([1, 2, 3])).toEqual([1, 2, 3])
})

test('an array should return the original array', () => {

  expect(toArray([1, [2, 3, 4]])).toEqual([1, [2, 3, 4]])
})
