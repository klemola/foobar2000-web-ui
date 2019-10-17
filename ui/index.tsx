import { h, render } from 'preact'

import App from './App'

require('modern-css-reset')
require('./css/main.css')

render(<App />, document.body)
