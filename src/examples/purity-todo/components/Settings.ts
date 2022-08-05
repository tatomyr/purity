import {render} from '../../../index.js'
import {downloadUserData, uploadUserData} from '../services/settings.js'
import {lineContainerCSS, lineTextCSS} from './ModalStyle.js'
import {ACTION_BUTTON} from './AppStyle.js'
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

    ul.settings  li #version {
      width: auto;
      font-size: 1.5rem;
      line-height: 2;
    }

  </style>
`

export const Settings = (): string => render`
  <ul class="settings">
    <li>
      <p>Backup</p>
      <button ::click=${downloadUserData} class="${ACTION_BUTTON}">
        ↧
      </button>
    </li>
    <li>
      <p>Restore</p>
      <label for="restore-backup" class="${ACTION_BUTTON}">
        ↥
        <input
          type="file"
          accept=".json"
          id="restore-backup"
          ::change=${uploadUserData}
        />
      </label>
    </li>
    <li>
      ${Version()}
    </li>
  </ul>
  ${SettingsStyle()}
`
