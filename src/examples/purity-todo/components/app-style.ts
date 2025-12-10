import {render} from "../../../index.js"

export const ACTION_BUTTON = "action-button"

export const appStyle = (): string => render`
  <style id="app-style">
    :root {
      --text-color: #3d3d3d;
      --background-color: #faf9f7;
      --bg-color-secondary: #e8e6e1;
      --shadow-color: rgba(0, 0, 0, .4);
      --accent-color: #4a90e2;
      --subtask-color: #a8a8a8;
      --button-active-bg: #d4d2ce;
      --input-color: #e0e0e0;
      --input-bg: #3d3d3d;
      --modal-overlay-bg: rgba(61, 61, 61, 0.4);
      --completed-opacity: 0.65;
      --control-button-bg: var(--accent-color);
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --text-color: #e0e0e0;
        --background-color: #1a1a2e;
        --bg-color-secondary: #3a3a55;
        --shadow-color: rgba(0, 0, 0, 0.5);
        --accent-color: #4a90e2;
        --subtask-color: #9ca3af;
        --button-active-bg: var(--accent-color);
        --input-color: var(--text-color);
        --input-bg: var(--bg-color-secondary);
        --modal-overlay-bg: rgba(0, 0, 0, 0.7);
        --completed-opacity: 0.5;
        --control-button-bg: var(--accent-color);
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
      background-color: var(--button-active-bg);
    }

    .${ACTION_BUTTON}.hidden {
      display: none;
    }

    .header {
      .${ACTION_BUTTON} {
        color: var(--background-color);
      }

      .${ACTION_BUTTON}:active,
      .${ACTION_BUTTON}.chosen {
        color: var(--text-color);
      }
    }

  </style>
`
