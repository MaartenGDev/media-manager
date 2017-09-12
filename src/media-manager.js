import merge from 'deepmerge'
import { toArray } from './utilities/array'
import { addClassesToNode, mergeSelectors, createClassSelector } from './utilities/css'

export class MediaManager {
  buildWrapper () {
    const settings = this.settings

    let wrapper = document
      .createElement('section')

    wrapper.classList.add(settings.classes.wrapper)

    return wrapper
  }

  _buildHeader () {
    const settings = this.settings

    const header = document.createElement('section')
    header.classList.add(settings.classes.header)

    const title = document.createElement('p')
    title.classList.add(settings.classes.headerTitle)

    const text = document.createTextNode(settings.names.title)

    title.appendChild(text)

    header.appendChild(title)

    return header
  }

  _buildActionBar () {
    const settings = this.settings

    let uploadButton = document.createElement('input')
    uploadButton.setAttribute('type', 'file')

    uploadButton = addClassesToNode(uploadButton, settings.classes.uploadButton)
    uploadButton.appendChild(document.createTextNode('Upload'))

    let actionBar = document.createElement('section')
    actionBar = addClassesToNode(actionBar, settings.classes.actionBar)
    actionBar.appendChild(uploadButton)

    return actionBar
  }

  _buildResourcePreviews () {
    const settings = this.settings

    const wrapper = document.createElement('section')
    wrapper.classList.add(settings.classes.contentWrapper)

    const resources = settings.source.paths.map(path => {
      const gridItem = document.createElement('section')
      gridItem.classList.add(settings.classes.item)
      gridItem.dataset.src = path

      gridItem.style.backgroundImage = `url('${path}')`
      gridItem.style.backgroundSize = 'contain'
      gridItem.style.backgroundRepeat = 'no-repeat'

      return gridItem
    })

    resources.forEach(x => wrapper.appendChild(x))

    return wrapper
  }

  _buildFooter () {
    const settings = this.settings
    const footer = document.createElement('section')
    footer.classList.add(settings.classes.footer)

    let confirmButton = document.createElement('button')
    confirmButton.setAttribute('type', 'button')
    confirmButton = addClassesToNode(confirmButton, settings.classes.confirmButton)
    confirmButton.appendChild(document.createTextNode('Confirm'))

    let cancelButton = document.createElement('button')
    cancelButton.setAttribute('type', 'button')
    cancelButton = addClassesToNode(cancelButton, settings.classes.cancelButton)
    cancelButton.appendChild(document.createTextNode('Cancel'))

    footer.appendChild(confirmButton)
    footer.appendChild(cancelButton)

    return footer
  }

  _deleteMediaManager () {
    this.settings.elements.wrapper.innerHTML = ''
  }

  _toggleMediaManager () {
    const settings = this.settings
    const isShown = settings.elements.wrapper.innerHTML !== ''
    if (isShown) return this._deleteMediaManager(settings)

    const wrapper = this.buildWrapper(settings)

    wrapper.appendChild(this._buildHeader(settings))
    wrapper.appendChild(this._buildActionBar(settings))
    wrapper.appendChild(this._buildResourcePreviews(settings))
    wrapper.appendChild(this._buildFooter(settings))

    settings.elements.wrapper.appendChild(wrapper)

    this._registerEventListenersForMediaActions(settings)
    this._registerEventListenersForActionBar(settings)
  }

  _registerEventListenersForActionBar (settings) {
    const uploadSelector = mergeSelectors(createClassSelector(toArray(settings.classes.uploadButton)))

    document.querySelector(uploadSelector).addEventListener('change', settings.events.onFileSelectionChanged)
  }

  _registerEventListenersForMediaActions (settings) {
    let selectedPaths = []

    settings.elements.wrapper.addEventListener('click', ({target}) => {
      if (target.classList.contains(settings.classes.item)) {
        target.classList.toggle(settings.classes.activeItem)

        const path = target.dataset.src
        const isActive = target.classList.contains(settings.classes.activeItem)

        if (isActive) {
          selectedPaths = [...selectedPaths, path]
        } else {
          selectedPaths = selectedPaths.filter(x => x !== path)
        }
      }
    })

    const confirmSelector = mergeSelectors(createClassSelector(toArray(settings.classes.confirmButton)))
    const cancelSelector = mergeSelectors(createClassSelector(toArray(settings.classes.cancelButton)))

    document.querySelector(confirmSelector).addEventListener('click', () => {
      settings.events.onConfirm(selectedPaths)
      this._deleteMediaManager()
    })

    document.querySelector(cancelSelector).addEventListener('click', evt => {
      evt.preventDefault()
      settings.events.onCancel()
      this._deleteMediaManager()
    })
  }

  toggle () {
    this._toggleMediaManager()
  }

  add (path) {
    const {wrapper, contentWrapper} = this.settings.classes

    const wrapperSelector = mergeSelectors(createClassSelector(toArray(wrapper)))
    const contentWrapperSelector = mergeSelectors(createClassSelector(toArray(contentWrapper)))

    this.settings.source.paths = [...this.settings.source.paths, path]

    document.querySelector(`${wrapperSelector} ${contentWrapperSelector}`).outerHTML = this._buildResourcePreviews().outerHTML
  }

  init (settings) {
    settings = merge({
      elements: {
        toggleElement: '',
        wrapper: ''
      },
      settings: {
        uploadEndpoint: ''
      },
      classes: {
        wrapper: 'media-manager',
        header: 'media-manager__header',
        headerTitle: 'media-manager__title',
        contentWrapper: 'media-manager__content',
        item: 'media-manager__item',
        activeItem: 'media-manager__item--active',
        footer: 'media-manager__footer',
        actionBar: 'media-manager__action-bar',
        confirmButton: ['media-manager__button', 'media-manager__button--confirm'],
        cancelButton: ['media-manager__button', 'media-manager__button--cancel'],
        uploadButton: ['media-manager__button', 'media-manager__button--upload']
      },
      names: {
        title: 'Media Manager'
      },
      events: {
        onCancel: () => {},
        onConfirm: () => {},
        onFileSelectionChanged: () => {}
      },
      source: {
        paths: []
      }
    }, settings)

    this.settings = settings

    settings.elements.toggleElement.addEventListener('click', () => {
      this._toggleMediaManager()
    })
  }
}

export default MediaManager
