import {render} from '../../index.js'

export const EditorStyle = (): string => render`
  <style id="playground-editor-style"> 
    #editor {
      width: ${localStorage.playgroundEditorWidth || '50%'};
      min-width: 10vw;
      max-width: 90vw;
      height: 100%;
      overflow-y: hidden;
    }
  </style>
`
