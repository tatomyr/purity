import {render} from '../../../index.js'
import {state} from '../app.js'
import {closeSettings} from '../services/settings.js'
import {closeTaskDetails} from '../services/task-details.js'
import {AppStyle} from './AppStyle.js'
import {Header} from './Header.js'
import {InputForm} from './InputForm.js'
import {Modal} from './Modal.js'
import {ModalStyle} from './ModalStyle.js'
import {Settings} from './Settings.js'
import {TaskDetails} from './TaskDetails.js'
import {TaskList} from './TaskList.js'

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
