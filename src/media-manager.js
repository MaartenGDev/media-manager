import merge from 'deepmerge'
import './media-manager.sass'

import { addClassesToNode, createSelector } from './utilities/css'

export default class MediaManager {
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

    const resources = settings.source.resources.map(resource => {
      const path = resource.path

      const gridItem = document.createElement('section')
      gridItem.classList.add(settings.classes.item)
      gridItem.dataset.src = path

      gridItem.style.backgroundImage = `url('${path}')`
      gridItem.style.backgroundSize = 'cover'
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

  _buildOverlay () {
    let overlaySection = document.createElement('section')
    overlaySection = addClassesToNode(overlaySection, this.settings.classes.overlay)

    return overlaySection
  }

  _appendOverlayIfNotPresent () {
    const overlaySelector = document.querySelector(createSelector(this.settings.classes.overlay))
    if (overlaySelector !== null) return

    const overlay = this._buildOverlay()

    document.querySelector('body').appendChild(overlay)
  }

  _toggleOverlay (mediaManagerIsShown) {
    this._appendOverlayIfNotPresent()
    const overlaySelector = document.querySelector(createSelector(this.settings.classes.overlay))

    overlaySelector.classList.toggle(this.settings.classes.activeOverlay, mediaManagerIsShown)
  }

  _deleteMediaManager () {
    this.settings.state.isShown = false
    this.settings.elements.wrapper.innerHTML = ''
  }

  _toggleMediaManager () {
    const settings = this.settings
    const {isShown} = settings.state

    if (settings.settings.showOverlay) {
      this._toggleOverlay(!isShown)
    }

    if (isShown) return this._deleteMediaManager(settings)

    const wrapper = this.buildWrapper()

    wrapper.appendChild(this._buildHeader())
    wrapper.appendChild(this._buildActionBar())
    wrapper.appendChild(this._buildResourcePreviews())
    wrapper.appendChild(this._buildFooter())

    settings.elements.wrapper.appendChild(wrapper)

    this._registerEventListenersForMediaActions()
    this._registerEventListenersForActionBar()

    this.settings.state.isShown = true
  }

  _registerEventListenersForActionBar () {
    const settings = this.settings
    const uploadSelector = createSelector(settings.classes.uploadButton)

    document.querySelector(uploadSelector).addEventListener('change', settings.events.onFileSelectionChanged)
  }

  _registerEventListenersForMediaActions () {
    const settings = this.settings
    let selectedResources = []

    settings.elements.wrapper.addEventListener('click', ({target}) => {
      if (target.classList.contains(settings.classes.item)) {
        const hasSelectedMaxItems = selectedResources.length === settings.settings.maxSelectedItems

        const path = target.dataset.src
        const hasBeenSelected = selectedResources.filter(resource => resource.path === path).length > 0

        if (hasBeenSelected) {
          selectedResources = selectedResources.filter(resource => resource.path !== path)

          target.classList.toggle(settings.classes.activeItem, false)
        } else if (!hasSelectedMaxItems) {
          selectedResources = [
            ...selectedResources,
            settings.source.resources.find(resource => resource.path === path)
          ]

          target.classList.toggle(settings.classes.activeItem, true)
        }

      }
    })

    const confirmSelector = createSelector(settings.classes.confirmButton)
    const cancelSelector = createSelector(settings.classes.cancelButton)

    document.querySelector(confirmSelector).addEventListener('click', () => {
      settings.events.onConfirm(selectedResources)
      this._toggleMediaManager()
    })

    document.querySelector(cancelSelector).addEventListener('click', evt => {
      evt.preventDefault()
      settings.events.onCancel()
      this._toggleMediaManager()
    })
  }

  on (eventName, callback) {
    this.settings.events[eventName] = callback
  }

  toggle () {
    this._toggleMediaManager()
  }

  _isValidResource (resource) {
    return typeof resource === 'object' && resource.hasOwnProperty('path')
  }

  add (resource) {
    if (!this._isValidResource(resource)) return console.error('The resource has to be an object with a path key.')
    const {wrapper, contentWrapper} = this.settings.classes

    const wrapperSelector = createSelector(wrapper)
    const contentWrapperSelector = createSelector(contentWrapper)

    this.settings.source.resources = [...this.settings.source.resources, resource]

    if (this.settings.state.isShown) {
      document.querySelector(`${wrapperSelector} ${contentWrapperSelector}`).outerHTML = this._buildResourcePreviews().outerHTML
    }
  }

  init (settings) {
    settings = merge({
      elements: {
        wrapper: ''
      },
      state: {
        isShown: false
      },
      settings: {
        showOverlay: true,
        maxSelectedItems: -1
      },
      classes: {
        wrapper: 'media-manager',
        overlay: 'media-manager__overlay',
        activeOverlay: 'media-manager__overlay--active',
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
        resources: []
      }
    }, settings)

    this.settings = settings
  }
}