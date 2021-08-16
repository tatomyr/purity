import {Component, render} from '../../../purity.js'
import {NavItem} from './NavItem.js'

const HeaderStyle: Component = () => render`
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
    }

    #header .nav-option.chosen {
      color: white;
    }

  </style>
`

export const Header: Component = () => render`
  <nav id="header">
    <ul>
      ${NavItem({value: 'active', label: '⊡'})}
      ${NavItem({value: 'completed', label: '⊠'})}
    </ul>
  </nav>
  ${HeaderStyle()}
`
