import './manager.sass'
import { init } from './manager'

init({
  elements: {
    toggleElement: document.querySelector('#selectImages'),
    wrapper: document.querySelector('.app')
  },
  source: {
    paths: ['https://unsplash.it/100/100?random&v=1', 'https://unsplash.it/100/100?random&v=2', 'https://unsplash.it/100/100?random&v=3', 'https://unsplash.it/100/100?random&v=4', 'https://unsplash.it/100/100?random&v=5', 'https://unsplash.it/100/100?random&v=6', 'https://unsplash.it/100/100?random&v=7', 'https://unsplash.it/100/100?random&v=8']
  },
  events: {
    onConfirm: selectedPaths => {
      console.log(selectedPaths)
    }
  }
})