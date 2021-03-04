import {defaultCode, updateScript} from './user-script-config.js'
import {configureMonacoEditor} from './monaco-editor-config.js'
import {useDrag} from './drag.js'

configureMonacoEditor(defaultCode, updateScript)

const initDrag = useDrag('editor')
;(document.querySelector('.resizer') as HTMLElement).addEventListener(
  'mousedown',
  initDrag
)

// TODO: ingore resizing errors
window.onerror = err => {
  ;(document.getElementById('root') as HTMLElement).innerHTML += `
    <pre id="error">${err}</pre>
  `
}
