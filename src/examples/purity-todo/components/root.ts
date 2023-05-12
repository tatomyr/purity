import {render} from '../../../index.js'
import {state} from '../app.js'
import {closeSettings} from '../services/settings.js'
import {closeTaskDetails} from '../services/task-details.js'
import {appStyle} from './app-style.js'
import {header} from './header.js'
import {inputForm} from './input-form.js'
import {Modal} from './Modal.js'
import {ModalStyle} from './ModalStyle.js'
import {Settings} from './Settings.js'
import {TaskDetails} from './TaskDetails.js'
import {TaskList} from './TaskList.js'

export const root = (): string => render`
  <div id="root">
    ${header()}
    ${TaskList()}
    ${inputForm()}
    ${appStyle()}
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
