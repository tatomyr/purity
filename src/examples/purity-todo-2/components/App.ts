import {render} from '../../../index.js'
import {startup} from '../services/startup.js'
import {Header} from './Header.js'
import {InputForm} from './InputForm.js'
import {Settings} from './Settings.js'
import {TaskList} from './TaskList.js'

startup()

const AppStyle = () => render`
  <style id="root-style">
    ul {
      width: 100%;
      list-style-type: none;
      padding: 0;
    }

    #root {
      position: relative;
      width: 100%;
      max-width: 100%;
      height: 100vh;
      max-height: 100vh;
    }
  </style>
`

export const App = () => render`
  <div id="root">
    ${Header()}
    ${TaskList()}
    ${InputForm()}
    ${AppStyle()}
    ${Settings()}
  </div>
`
