import {render} from '../../../index.js'
import {setState, state} from '../app.js'
import {downloadUserData, uploadUserData} from '../services/settings.js'

const SettingsStyle = () => render`
  <style>
    #settings {
      display: none;

      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: #50505030;
      z-index: 1;
    }

    #settings.open {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #settings .modal-content {
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
    .modal-content ul li label {
      all: unset;
      width: 3rem;
      min-width: 3rem;
      height: 3rem;
      text-align: center;
      font-size: 2rem;
      line-height: 1;
      cursor: default;
    }

    .modal-content ul li button:active,
    .modal-content ul li label:active {
      background-color: grey;
    }

    #backup {
      display: none;
    }

  </style>
`

export const Settings = () => render`
  <div id="settings" class="${state.settingsModal}">
    <div class="modal-content">
      <ul>
        <li class="header">
          <p>Settings</p>
          <button
            ::click=${e => setState(() => ({settingsModal: ''}))}
          >⨯</button>
        </li>
        <li>
          <p>Backup</p>
          <button
            ::click=${downloadUserData}
          >↧</button>
        </li>
        <li>
          <p>Restore</p>
            <label for="backup">
              ↥
            <input
              type="file"
              accept=".json"
              id="backup"
              ::change=${({target}) => {
                const [file] = (<HTMLInputElement>target).files as FileList
                uploadUserData(file)
              }}
            />
            </label>
        </li>

      </ul>
    </div>
  </div>
  ${SettingsStyle()}
`
