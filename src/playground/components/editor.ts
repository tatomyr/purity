import {delay, render} from '../../index.js'
import {getState, setState, useAsync} from '../index.js'
import {configureMonacoEditor} from '../services/monaco-editor-config.js'
import {createUpdate, defaultCode} from '../services/user-code.js'
import {editorStyle} from './editor-style.js'

export const getEditor = (): HTMLElement => document.getElementById('editor')!

export const editor = (): string => {
  useAsync('configure-editor', async () => { // TODO: replace with once()
    await delay()
    configureMonacoEditor({
      domElement: getEditor(),
      defaultCode,
      onChange: createUpdate((code: string) => setState(() => ({code}))),
    })
  }).call()

  return render`
    <div id="editor"></div>
    ${editorStyle()}
  `
}
