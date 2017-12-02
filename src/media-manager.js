import merge from 'deepmerge'
import './media-manager.sass'

import { addClassesToNode, createSelector } from './utilities/css'

export default class MediaManager {
  _buildWrapper () {
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

    const text = document.createTextNode(settings.labels.title)

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

      gridItem.style.position = `relative`
      gridItem.style.backgroundImage = `url('${path}')`
      gridItem.style.backgroundSize = 'cover'
      gridItem.style.backgroundRepeat = 'no-repeat'

      let deleteIcon = document.createElement('i')
      deleteIcon = addClassesToNode(deleteIcon, settings.classes.deleteItemIcon)
      deleteIcon.appendChild(document.createTextNode('delete'))
      deleteIcon.dataset.src = resource.path

      gridItem.appendChild(deleteIcon)

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

  _toggleMediaManager () {
    const settings = this.settings
    const {isShown} = settings.state

    if (settings.settings.showOverlay) {
      this._toggleOverlay(!isShown)
    }

    this._clearSelectedItems()
    const mediaManager = settings.elements.wrapper.querySelector(createSelector(settings.classes.wrapper))
    console.log(mediaManager)

    if (mediaManager !== null) {
      mediaManager.style.display = isShown ? 'none' : 'block'
    } else {
      this._appendMediaManagerToWrapper()
    }

    this.settings.state.selectedResources = []
    this.settings.state.isShown = !isShown
  }

  _clearSelectedItems () {
    const {classes} = this.settings
    const activeItemsSelector = createSelector([classes.item, classes.activeItem])

    document.querySelectorAll(activeItemsSelector).forEach(x => {
      x.classList.remove(classes.activeItem)
    })
  }

  _appendMediaManagerToWrapper () {
    const wrapper = this._buildWrapper()

    wrapper.appendChild(this._buildHeader())
    wrapper.appendChild(this._buildActionBar())
    wrapper.appendChild(this._buildResourcePreviews())
    wrapper.appendChild(this._buildFooter())

    this.settings.elements.wrapper.appendChild(wrapper)

    this._registerEventListenersForMediaActions()
    this._registerEventListenersForActionBar()
  }

  _registerEventListenersForActionBar () {
    const settings = this.settings
    const uploadSelector = createSelector(settings.classes.uploadButton)

    document.querySelector(uploadSelector).addEventListener('change', settings.events.onFileSelectionChanged)
  }

  _registerEventListenersForMediaActions () {
    const settings = this.settings

    settings.elements.wrapper.addEventListener('click', ({target}) => {
      if (target.classList.contains(settings.classes.item)) {
        const selectedResources = this.settings.state.selectedResources
        const hasSelectedMaxItems = selectedResources.length === settings.settings.maxSelectedItems

        const path = target.dataset.src
        const hasBeenSelected = selectedResources.filter(resource => resource.path === path).length > 0

        if (hasBeenSelected) {
          this.settings.state.selectedResources = selectedResources.filter(resource => resource.path !== path)

          target.classList.toggle(settings.classes.activeItem, false)
        } else if (!hasSelectedMaxItems) {
          this.settings.state.selectedResources = [
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
      settings.events.onConfirm(this.settings.state.selectedResources)
      this._toggleMediaManager()
    })

    document.querySelector(cancelSelector).addEventListener('click', evt => {
      evt.preventDefault()
      settings.events.onCancel()
      this._toggleMediaManager()
    })

    this._registerDeleteItemEventListeners()
  }

  _registerDeleteItemEventListeners () {
    const {events, classes, source} = this.settings
    const deleteItemSelector = createSelector(classes.deleteItemIcon);

    [...document.querySelectorAll(deleteItemSelector)].forEach(e => {
      e.addEventListener('click', evt => {
        evt.preventDefault()
        const selectedResource = source.resources.find(x => x.path === evt.target.dataset.src)
        return Promise.resolve(events.onDeleteItem(selectedResource))
          .then(deleteIsConfirmed => {
            if (deleteIsConfirmed) {
              this._remove(selectedResource)
            }
          })
      })
    })
  }

  _isValidResource (resource) {
    return typeof resource === 'object' && resource.hasOwnProperty('path')
  }

  _remove (resource) {
    this.settings.source.resources = [...this.settings.source.resources].filter(x => x.path !== resource.path)
    this.settings.state.selectedResources = []

    this._refreshResourcePreviews()
  }

  _refreshResourcePreviews () {
    const {wrapper, contentWrapper} = this.settings.classes
    const wrapperSelector = createSelector(wrapper)
    const contentWrapperSelector = createSelector(contentWrapper)
    if (this.settings.state.isShown) {
      document.querySelector(`${wrapperSelector} ${contentWrapperSelector}`).outerHTML = this._buildResourcePreviews().outerHTML
    }

    this._registerDeleteItemEventListeners()
  }

  on (eventName, callback) {
    this.settings.events[eventName] = callback
  }

  toggle () {
    this._toggleMediaManager()
  }

  add (resource) {
    if (!this._isValidResource(resource)) return console.error('The resource has to be an object with a path key.')
    this.settings.source.resources = [...this.settings.source.resources, resource]
    this._refreshResourcePreviews()
  }

  init (settings) {
    settings = merge({
      elements: {
        wrapper: ''
      },
      state: {
        isShown: false,
        selectedResources: []
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
        deleteItemIcon: ['material-icons', 'media-manager__trash-icon'],
        footer: 'media-manager__footer',
        actionBar: 'media-manager__action-bar',
        confirmButton: ['media-manager__button', 'media-manager__button--confirm'],
        cancelButton: ['media-manager__button', 'media-manager__button--cancel'],
        uploadButton: ['media-manager__button', 'media-manager__button--upload']
      },
      labels: {
        title: 'Media Manager'
      },
      events: {
        onCancel: () => {},
        onConfirm: () => {},
        onDeleteItem: () => {},
        onFileSelectionChanged: () => {}
      },
      source: {
        resources: []
      }
    }, settings)

    this.settings = settings
  }
}