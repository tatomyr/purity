import {defaultCode, updateScript} from './user-script-config.js'
import {configureMonacoEditor} from './monaco-editor-config.js'

configureMonacoEditor(defaultCode, updateScript)

window.onerror = err => {
  ;(document.getElementById('root') as HTMLElement).innerHTML = `
    <div style="text-align: center; color: red; ">
      ${err}
    </div>
  `
}
