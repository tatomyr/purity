// Source: https://stackoverflow.com/questions/63179813/how-to-run-the-monaco-editor-from-a-cdn-like-cdnjs
import type {UpdateCode} from './user-code.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: any

declare let window: Window & {
  MonacoEnvironment: monaco.Environment
}

type MonacoEditorConfig = {
  domElement: HTMLElement
  defaultCode: string
  onChange: UpdateCode
}

export function configureMonacoEditor({
  domElement,
  defaultCode,
  onChange,
}: MonacoEditorConfig): void {
  // Provided by loader.min.js.
  require.config({
    paths: {
      vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs',
    },
  })
  window.MonacoEnvironment = {
    getWorkerUrl: () => proxy,
  }
  const proxy = URL.createObjectURL(
    new Blob(
      [
        `
            self.MonacoEnvironment = {
                baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min'
            };
            importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs/base/worker/workerMain.min.js');
        `,
      ],
      {type: 'text/javascript'}
    )
  )
  require(['vs/editor/editor.main'], function () {
    const editor = monaco.editor.create(domElement, {
      value: defaultCode,
      language: 'javascript',
      theme: 'vs-dark',
      minimap: {
        enabled: false,
      },
      automaticLayout: true,
    })

    onChange(editor.getValue())

    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue())
    })
  })
}
