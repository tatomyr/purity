import {render} from '../../../index.js'
import {setState} from '../app.js'
import {NavItem} from './NavItem.js'

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

    #header .nav-option {
      all: unset;
      font-size: 2rem;
      line-height: 1;
      width: 3rem;
      min-width: 3rem;
      height: 3rem;
      text-align: center;
    }

    #header .nav-option:active {
      background-color: grey;
    }

    #header .nav-option.chosen {
      color: white;
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
          class="nav-option"
          ::click=${e => {
            setState(() => ({settingsModal: 'open'}))
          }}
        >
          ⋮
        </button>
      </li>
    </ul>
  </nav>
  ${HeaderStyle()}
`
