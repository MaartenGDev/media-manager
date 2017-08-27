import './manager.sass'

import { init } from './manager'

init({
  elements: {
    toggleElement: document.querySelector('#selectImages'),
    wrapper: document.querySelector('.app')
  },
  source: {
    paths: ['https://unsplash.it/100/100', 'https://unsplash.it/100/100', 'https://unsplash.it/300/200', 'https://unsplash.it/150/100', 'https://unsplash.it/90/90', 'https://unsplash.it/100/100', 'https://unsplash.it/100/100']
  }
})