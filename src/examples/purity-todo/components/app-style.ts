import {render} from "../../../index.js"

export const ACTION_BUTTON = "action-button"

export const appStyle = (): string => render`
  <style id="app-style">
    :root {
      --background-color: #f0f0f0;
      --text-color: #555;
      --shadow-color: #555;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --background-color: #484848;
        --text-color: #f0f0f0;
        --shadow-color: #000;
      }
    }

    *,
    *::before,
    *::after {
      font-family: sans-serif;
      font-size: 20px;
      color: var(--text-color);
    }

    input[type='file'] {
      display: none;
    }

    body {
      position: relative;
      height: 100vh;
      background-color: var(--background-color);
      color: var(--text-color);
    }

    ol,
    ul {
      list-style-type: none;
      padding: 0;
    }

    #root {
      height: 100%;
      max-height: 100%;

      display: flex;
      flex-direction: column;

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
      color: var(--background-color);
    }

  </style>
`
