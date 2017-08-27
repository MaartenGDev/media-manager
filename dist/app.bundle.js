/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

var _manager = __webpack_require__(2);

(0, _manager.init)({
  elements: {
    toggleElement: document.querySelector('#selectImages'),
    wrapper: document.querySelector('.app')
  },
  source: {
    paths: ['https://unsplash.it/100/100', 'https://unsplash.it/100/100', 'https://unsplash.it/300/200', 'https://unsplash.it/150/100', 'https://unsplash.it/90/90', 'https://unsplash.it/100/100', 'https://unsplash.it/100/100']
  },
  events: {
    onConfirm: function onConfirm(selectedPaths) {
      console.log(selectedPaths);
    }
  }
});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var buildWrapper = function buildWrapper(settings) {
  var wrapper = document.createElement('section');

  wrapper.classList.add(settings.classes.wrapper);

  return wrapper;
};

var buildHeader = function buildHeader(settings) {
  var header = document.createElement('section');
  header.classList.add(settings.classes.header);

  var title = document.createElement('p');
  title.classList.add(settings.classes.headerTitle);

  var text = document.createTextNode(settings.names.title);

  title.appendChild(text);

  header.appendChild(title);

  return header;
};

var buildResourcePreviews = function buildResourcePreviews(settings) {
  var wrapper = document.createElement('section');
  wrapper.classList.add(settings.classes.contentWrapper);

  var resources = settings.source.paths.map(function (path) {
    var gridItem = document.createElement('section');
    gridItem.classList.add(settings.classes.item);
    gridItem.dataset.src = path;

    gridItem.style.backgroundImage = 'url(\'' + path + '\')';
    gridItem.style.backgroundSize = 'contain';
    gridItem.style.backgroundRepeat = 'no-repeat';

    return gridItem;
  });

  resources.forEach(function (x) {
    return wrapper.appendChild(x);
  });

  return wrapper;
};

var buildFooter = function buildFooter(settings) {
  var footer = document.createElement('section');
  footer.classList.add(settings.classes.footer);

  var confirmButton = document.createElement('button');
  confirmButton.classList.add(settings.classes.button);
  confirmButton.appendChild(document.createTextNode('Confirm'));

  footer.appendChild(confirmButton);

  return footer;
};
var hideMediaManager = function hideMediaManager(settings) {
  settings.elements.wrapper.innerHTML = '';
};

var toggleMediaManager = function toggleMediaManager(settings) {
  var isShown = settings.elements.wrapper.innerHTML !== '';
  if (isShown) return hideMediaManager(settings);

  var wrapper = buildWrapper(settings);

  wrapper.appendChild(buildHeader(settings));
  wrapper.appendChild(buildResourcePreviews(settings));
  wrapper.appendChild(buildFooter(settings));

  settings.elements.wrapper.appendChild(wrapper);

  addEventListenersForMediaActions(settings);
};

var addEventListenersForMediaActions = function addEventListenersForMediaActions(settings) {
  var selectedPaths = [];

  settings.elements.wrapper.addEventListener('click', function (evt) {
    if (evt.target.classList.contains(settings.classes.item)) {
      evt.target.classList.toggle(settings.classes.activeItem);

      var path = evt.target.dataset.src;
      var isActive = evt.target.classList.contains(settings.classes.activeItem);

      if (isActive) {
        selectedPaths = [].concat(_toConsumableArray(selectedPaths), [path]);
      } else {
        selectedPaths = selectedPaths.filter(function (x) {
          return x !== path;
        });
      }
    }
  });

  document.querySelector('.' + settings.classes.button).addEventListener('click', function () {
    settings.events.onConfirm(selectedPaths);
    hideMediaManager(settings);
  });
};

var init = exports.init = function init(settings) {
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
    events: {
      onConfirm: function onConfirm() {}
    },
    source: {
      paths: []
    }
  }, settings);

  settings.elements.toggleElement.addEventListener('click', function () {
    toggleMediaManager(settings);
  });
};

exports.default = { init: init };

/***/ })
/******/ ]);