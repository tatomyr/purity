import {render} from '../../../index.js'

export const ACTION_BUTTON = 'action-button'

export const AppStyle = (): string => render`
  <style id="root-style">
    ol, 
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

    .${ACTION_BUTTON} {
      all: unset;
      width: 3rem;
      min-width: 3rem;
      height: 3rem;
      text-align: center;
      font-size: 2rem;
      line-height: 1;
    }

    .${ACTION_BUTTON}:active {
      background-color: grey;
      color: white;
    }

    .${ACTION_BUTTON}.hidden {
      display: none;
    }

    .${ACTION_BUTTON}.chosen {
      color: white;
    }

  </style>
`
