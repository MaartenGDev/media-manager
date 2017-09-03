import { toArray } from './array'
import { isString } from './typeof'

const selectorTypeIndicators = ['.', '#']

export const addClassesToNode = (node, classes) => {
  classes = toArray(classes)
  node.classList.add(...classes)

  return node
}

const startsWithSelectorTypeIndicator = selector => {
  return selectorTypeIndicators.filter(x => selector.startsWith(x)).length > 0
}

export const mergeSelectors = classes => classes.join('')

export const createClassSelector = selector => {
  if (isString(selector)) {
    return startsWithSelectorTypeIndicator(selector) ? selector : `.${selector}`
  }

  return selector.map(c => startsWithSelectorTypeIndicator(c) ? c : `.${c}`)
}

export default {addClassesToNode, mergeSelectors, createClassSelector}
