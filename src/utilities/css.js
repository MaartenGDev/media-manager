import { toArray } from './array'

export const addClassesToNode = (node, classes) => {
  classes = toArray(classes)
  node.classList.add(...classes)

  return node
}

export const mergeClasses = classes => classes.join('')
export const createClassSelectors = classes => classes.map(c => `.${c}`)

export default {addClassesToNode, mergeClasses, createClassSelectors}
