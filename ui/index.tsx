import { h, render } from 'preact'

import App from './App'

require('modern-css-reset')
require('./css/main.css')

// Replaces the native VH CSS unit with a custom variable so that browser chrome doesn't overlap with app controls.
const setRealVH = () => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
}

window.addEventListener('resize', setRealVH)
window.addEventListener('load', setRealVH)

// Briefly "activates" buttons on tap
document.addEventListener('touchstart', function() {}, false)

render(<App />, document.body)
