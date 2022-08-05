import {render} from '../../../index.js'
import {openSettings} from '../services/settings.js'
import {NavItem} from './NavItem.js'
import {ACTION_BUTTON} from './AppStyle.js'

const HeaderStyle = (): string => render`
  <style id="header-style">
    #header {
      background-color: lightgrey;
      height: 3rem;
      min-height: 3rem;
      max-width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
    }

    #header ul {
      display: flex;
      justify-content: space-around;
      height: 100%;
      align-items: center;
    }

  </style>
`

export const Header = (): string => render`
  <nav id="header">
    <ul>
      ${NavItem({value: 'active', label: '⊡'})}
      ${NavItem({value: 'completed', label: '⊠'})}
      <li>
        <button
          class="${ACTION_BUTTON}"
          ::click=${openSettings}
        >
          ⋮
        </button>
      </li>
    </ul>
  </nav>
  ${HeaderStyle()}
`
