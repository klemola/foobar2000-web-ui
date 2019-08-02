import { h, render } from 'preact'
import { InfoMessage } from '../server/Models'

const el = document.createElement('div')
const message: InfoMessage = {
    type: 'info',
    data: 'test'
}

document.body.appendChild(el)
render(
    h('div', null, [
        h('div', null, 'Hello, Preact!'),
        h('pre', null, JSON.stringify(message))
    ]),
    el
)
