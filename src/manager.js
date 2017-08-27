const buildWrapper = settings => {
  let wrapper = document
    .createElement('section')

  wrapper.classList.add(settings.classes.wrapper)

  return wrapper
}

const buildHeader = settings => {
  const header = document.createElement('section')
  header.classList.add(settings.classes.header)

  const title = document.createElement('p')
  title.classList.add(settings.classes.headerTitle)

  const text = document.createTextNode(settings.names.title)

  title.appendChild(text)

  header.appendChild(title)

  return header
}

const buildResourcePreviews = settings => {
  const wrapper = document.createElement('section')
  wrapper.classList.add(settings.classes.contentWrapper)

  const resources = settings.source.paths.map(path => {
    const gridItem = document.createElement('section')
    gridItem.classList.add(settings.classes.item)

    gridItem.style.backgroundImage = `url('${path}')`
    gridItem.style.backgroundSize = 'contain'
    gridItem.style.backgroundRepeat = 'no-repeat'

    return gridItem
  })

  resources.forEach(x => wrapper.appendChild(x))

  return wrapper
}

const buildFooter = settings => {
  const footer = document.createElement('section')
  footer.classList.add(settings.classes.footer)

  const confirmButton = document.createElement('button')
  confirmButton.classList.add(settings.classes.button)
  confirmButton.appendChild(document.createTextNode('Confirm'))

  footer.appendChild(confirmButton)

  return footer
}

const toggleMediaManager = (isShown, settings) => {
  if (!isShown) {
    settings.elements.wrapper.innerHTML = ''
    return
  }
  const wrapper = buildWrapper(settings)

  wrapper.appendChild(buildHeader(settings))
  wrapper.appendChild(buildResourcePreviews(settings))
  wrapper.appendChild(buildFooter(settings))

  settings.elements.wrapper.appendChild(wrapper)
}

const addEventListenersForMediaActions = settings => {
  settings.elements.wrapper.addEventListener('click', (evt) => {
    if (evt.target.classList.contains(settings.classes.item)) {
      evt.target.classList.toggle(settings.classes.activeItem)
    }
  })
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
      header: 'media-manager__header',
      headerTitle: 'media-manager__title',
      contentWrapper: 'media-manager__content',
      item: 'media-manager__item',
      activeItem: 'media-manager__item--active',
      footer: 'media-manager__footer',
      button: 'media-manager__button'
    },
    names: {
      title: 'Media Manager'
    },
    source: {
      paths: []
    }
  }, settings)

  settings.elements.toggleElement.addEventListener('click', () => {
    isShown = !isShown

    toggleMediaManager(isShown, settings)
  })

  addEventListenersForMediaActions(settings)
}

export default {init}
