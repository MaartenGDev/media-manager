const buildWrapper = settings => {
  let wrapper = document
    .createElement('section')

  wrapper.classList.add(settings.classes.wrapper)

  return wrapper
}

const buildHeader = settings => {
  const header = document.createElement('section')
  header.classList.add(settings.classes.header)

  return header;
}

const buildResourcePreviews = settings => {
  return settings.source.paths.map(path => {
    const img = document.createElement('img')
    img.src = path
    return img
  })
}

const toggleMediaManager = (isShown, settings) => {
  if (!isShown) {
    settings.elements.wrapper.innerHTML = ''
    return
  }

  const wrapper = buildWrapper(settings)
  const header = buildHeader(settings)

  wrapper.appendChild(header)

  const resources = buildResourcePreviews(settings);

  resources.forEach(x => wrapper.appendChild(x))

  settings.elements.wrapper.appendChild(wrapper)
}

export const init = settings => {
  let isShown = false

  settings = Object.assign({}, {
    elements: {
      toggleElement: '',
      wrapper: ''
    },
    classes: {
      wrapper: 'media-manager',
      header: 'media-manager__header'
    },
    source: {
      paths: []
    }
  }, settings)

  settings.elements.toggleElement.addEventListener('click', () => {
    isShown = !isShown

    toggleMediaManager(isShown, settings)
  })
}

export default {init}
