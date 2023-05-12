import {render} from '../../index.js'

export const editorStyle = (): string => render`
  <style id="playground-editor-style"> 
    #editor {
      width: ${localStorage.playgroundEditorWidth /* TODO: use retrieveJSON */|| '50%'};
      min-width: 10vw;
      max-width: 90vw;
      height: 100%;
      overflow-y: hidden;
    }
  </style>
`
