import MediaManager from '../src/media-manager'
/* global DOMParser */
const domParser = new DOMParser()

const mockDOMHtml = `<html><head></head><body><main><section class="wrapper"></section><button id="selectImages">Open</button></main></body></html>`

test('wrapper should be empty after init', () => {
  const mockDOM = domParser.parseFromString(mockDOMHtml, 'text/html')

  const mediaManager = new MediaManager()

  mediaManager.init({
    elements: {
      toggleElement: mockDOM.querySelector('#selectImages'),
      wrapper: mockDOM.querySelector('.wrapper')
    },
    source: {
      paths: ['https://unsplash.it/100/100?random&v=1', 'https://unsplash.it/100/100?random&v=2']
    },
    events: {
      onConfirm: selectedPaths => {
        console.log(selectedPaths)
      },
      onFileSelectionChanged: changeEvent => {
        console.log(changeEvent)
      }
    }
  })

  document.querySelector('#selectImages').addEventListener('click', () => {
    mediaManager.toggle()
  })

  expect(mockDOM.documentElement.outerHTML).toEqual('<html><head></head><body><main><section class="wrapper"></section><button id="selectImages">Open</button></main></body></html>')
})
