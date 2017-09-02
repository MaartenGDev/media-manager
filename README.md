# Media Manager
Plain javascript media selector.

## Preview
![Media Manager](./preview.png)

## Design
![Design](./design.png)

## Usage
### html
```html
<section class="app"></section>
<button id="selectImages">Open</button>
```
### Javascript
```js
import { init } from './manager'
import './manager.sass'

init({
  elements: {
    toggleElement: document.querySelector('#selectImages'),
    wrapper: document.querySelector('.app')
  },
  source: {
    paths: ['https://unsplash.it/100/100?random&v=1', 'https://unsplash.it/100/100?random&v=2', 'https://unsplash.it/100/100?random&v=3', 'https://unsplash.it/100/100?random&v=4', 'https://unsplash.it/100/100?random&v=5', 'https://unsplash.it/100/100?random&v=6', 'https://unsplash.it/100/100?random&v=7', 'https://unsplash.it/100/100?random&v=8']
  },
  events: {
    // Fires when the user pressed "Confirm"
    onConfirm: selectedPaths => {
      console.log(selectedPaths)
    }
  }
})
```
### Styles
If you prefer importing the styles in a separate sass file use the following import statement.
```sass
@import "manager"
```

## Development
1: [Fork the repository](https://help.github.com/articles/fork-a-repo/)  
2: Install the dependencies
```bash
yarn install
// or
npm install
```
3: start webpack
```bash
yarn dev
```

## Stack
- Yarn
- Webpack
    - babel-loader
    - css-loader
    - sass-loader