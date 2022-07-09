import {render} from '../../../index.js'
import {state} from '../app.js'
import {Header} from './Header.js'
import {InputForm} from './InputForm.js'
import {Settings} from './Settings.js'
import {TaskList} from './TaskList.js'

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

export const App = (): string => render`
  <div id="root">
    ${Header()}
    ${TaskList()}
    ${InputForm()}
    ${AppStyle()}
    <div id="settings">
      ${state.isSettingsModalOpen && Settings()}
    </div>
  </div>
`
