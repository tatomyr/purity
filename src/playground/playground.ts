import {defaultCode, updateScript} from './user-script-config.js'
import {configureMonacoEditor} from './monaco-editor-config.js'
import {useDrag} from './drag.js'

configureMonacoEditor(defaultCode, updateScript)

const $resizable = document.getElementById('editor')

if (localStorage.playgroundEditorWidth && $resizable) {
  $resizable.style.width = localStorage.playgroundEditorWidth
}

const initDrag = useDrag($resizable, width => {
  localStorage.playgroundEditorWidth = width
})

const $resizer = document.querySelector('.resizer') as HTMLElement

$resizer.addEventListener('mousedown', initDrag)

// TODO: ingore resizing (and other outer) errors
window.onerror = err => {
  ;(document.getElementById('root') as HTMLElement).innerHTML += `
    <pre id="error">${err}</pre>
  `
}
