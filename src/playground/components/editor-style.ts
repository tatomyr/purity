import {render} from '../../index.js'
import { storage } from '../services/storage.js'

export const editorStyle = (): string => render`
  <style id="playground-editor-style"> 
    #editor {
      width: ${storage.get({editorWidth: '50%'}).editorWidth};
      min-width: 10vw;
      max-width: 90vw;
      height: 100%;
      overflow-y: hidden;
    }
  </style>
`
