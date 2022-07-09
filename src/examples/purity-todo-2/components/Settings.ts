import {render} from '../../../index.js'
import {
  closeSettings,
  downloadUserData,
  uploadUserData,
} from '../services/settings.js'
import {useTasks} from '../services/tasks.js'
import {Version} from './Version.js'

const SettingsStyle = () => render`
  <style>
    .modal-wrapper {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: #50505030;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-wrapper .modal-content {
      max-width: 90vw;
      max-height: 90vh;
      width: 90vh;
      height: 90vw;

      overflow-y: auto;
      background-color: white;
      border: 1px solid wheat;
    }

    .modal-content .header {
      background-color: lightgrey;
      font-weight: bold;
    }

    .modal-content ul li {
      display: flex;
      border-bottom: 1px solid lightgrey;
      height: 3rem;
      min-height: 3rem;
      align-items: center;
      padding: 0;
    }

    .modal-content ul li p {
      flex-grow: 1;
      padding: 2px 8px;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }

    .modal-content ul li button,
    .modal-content ul li label,
    .modal-content ul li #version {
      all: unset;
      width: 3rem;
      min-width: 3rem;
      height: 3rem;
      text-align: center;
      font-size: 2rem;
      cursor: default;
      box-sizing: border-box;
    }
    .modal-content ul li #version {
      width: auto;
      padding: 8px;
    }

    .modal-content ul li button:active,
    .modal-content ul li label:active {
      background-color: grey;
    }

    #restore-backup {
      display: none;
    }

  </style>
`

export const Settings = (): string => render`
  <div
    class="modal-wrapper"
    ::click=${closeSettings}
  >
    <div
      class="modal-content"
      ::click=${e => e.stopPropagation()}
    >
      <ul>
        <li class="header">
          <p>Settings</p>
          <button ::click=${closeSettings}>
            ⨯
          </button>
        </li>
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
    </div>
  </div>
  ${SettingsStyle()}
`
