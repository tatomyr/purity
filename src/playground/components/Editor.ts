import {delay, render} from '../../index.js'
import {getState, setState, useAsync} from '../playground.js'
import {configureMonacoEditor} from '../services/monaco-editor-config.js'
import {createUpdate, defaultCode} from '../services/user-code.js'
import {EditorStyle} from './EditorStyle.js'

export const getEditor = (): HTMLElement => document.getElementById('editor')!

export const Editor = (): string => {
  useAsync('configure-editor', async () => {
    await delay()
    configureMonacoEditor({
      domElement: getEditor(),
      defaultCode,
      onChange: createUpdate((code: string) => setState(() => ({code}))),
    })
  }).call()

  return render`
    <div id="editor"></div>
    ${EditorStyle()}
  `
}
