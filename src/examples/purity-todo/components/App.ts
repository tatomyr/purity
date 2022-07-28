import {render} from '../../../index.js'
import {state} from '../app.js'
import {closeSettings} from '../services/settings.js'
import {closeTaskDetails} from '../services/task-details.js'
import {Header} from './Header.js'
import {InputForm} from './InputForm.js'
import {Modal} from './Modal.js'
import {ModalStyle} from './ModalStyle.js'
import {Settings} from './Settings.js'
import {TaskDetails} from './TaskDetails.js'
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
      ${
        state.isSettingsModalOpen &&
        Modal({
          title: 'Settings',
          content: Settings(),
          close: closeSettings,
        })
      }
    </div>
    <div id="task-details">
      ${
        state.taskDetailId &&
        Modal({
          title: 'Details',
          content: TaskDetails(),
          close: closeTaskDetails,
        })
      }
    </div>
    ${ModalStyle()}
  </div>
`
