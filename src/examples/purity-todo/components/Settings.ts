import {render} from '../../../index.js'
import {downloadUserData, uploadUserData} from '../services/settings.js'
import {useTasks} from '../services/tasks.js'
import {lineButtonCSS, lineContainerCSS, lineTextCSS} from './ModalStyle.js'
import {Version} from './Version.js'

const SettingsStyle = () => render`
  <style>
    ul.settings  li {
      border-bottom: 1px solid lightgrey;
      ${lineContainerCSS}
    }

    ul.settings  li p {
      ${lineTextCSS}
    }

    ul.settings  li button,
    ul.settings  li label,
    ul.settings  li #version {
      ${lineButtonCSS}
    }
    ul.settings  li #version {
      width: auto;
      padding: 8px;
    }

    ul.settings  li button:active,
    ul.settings  li label:active {
      background-color: grey;
    }

  </style>
`

export const Settings = (): string => render`
  <ul class="settings">
    <li>
      <p>Backup</p>
      <button ::click=${downloadUserData}>
        ↧
      </button>
    </li>
    <li>
      <p>Restore</p>
      <label for="restore-backup">
        ↥
        <input
          type="file"
          accept=".json"
          id="restore-backup"
          ::change=${({target}) => {
            const [file] = (<HTMLInputElement>target).files as FileList
            useTasks.fire({mutation: () => uploadUserData(file)})
          }}
        />
      </label>
    </li>
    <li>
      ${Version()}
    </li>
  </ul>
  ${SettingsStyle()}
`
