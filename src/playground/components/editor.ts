import {render} from "../../index.js"
import {getState, setState, once} from "../index.js"
import {configureMonacoEditor} from "../services/monaco-editor-config.js"
import {createUpdate, defaultCode} from "../services/user-code.js"
import {editorStyle} from "./editor-style.js"

export const getEditor = (): HTMLElement =>
  document.getElementById("editor") as HTMLElement

export const editor = (): string => {
  once("configure-editor", () => {
    configureMonacoEditor({
      domElement: getEditor(),
      defaultCode,
      onChange: createUpdate((code: string) => setState(() => ({code}))),
    })
  })

  return render`
    <div id="editor"></div>
    ${editorStyle()}
  `
}
