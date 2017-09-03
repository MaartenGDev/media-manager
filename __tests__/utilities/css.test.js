import { addClassesToNode, mergeSelectors, createClassSelector } from '../../src/utilities/css'

test('the classList of the node should contain the new class', () => {
  let node = document.createElement('button')
  node = addClassesToNode(node, 'hello')
  node = addClassesToNode(node, 'world')

  expect(Array.from(node.classList)).toEqual(['hello', 'world'])
})

test('multiple css selectors should be converted to one selector', () => {
  const mergedClasses = mergeSelectors(['.my','.selector', '#here'])

  expect(mergedClasses).toEqual('.my.selector#here')
})

test('string without selector type indicator should get a . prefix', () => {
  const selector = createClassSelector('test')

  expect(selector).toEqual('.test')
})

test('all strings in array without a selector type indicator should get a . prefix', () => {
  const selectors = createClassSelector(['hello', 'world', 'test'])

  expect(selectors).toEqual(['.hello', '.world', '.test'])
})

test('string that contains a class type indicator should not get a . prefix', () => {
  const selector = createClassSelector('.hello')

  expect(selector).toEqual('.hello')
})

test('string that contains an id type indicator should not get a . prefix', () => {
  const selector = createClassSelector('#hello')

  expect(selector).toEqual('#hello')
})

test('only strings in the array that do not contain a selector type indicator should get a . prefix', () => {
  const selector = createClassSelector(['.hello', 'world', '#test'])

  expect(selector).toEqual(['.hello', '.world', '#test'])
})