import {render} from "../../../index.js"

export const ACTION_BUTTON = "action-button"

export const appStyle = (): string => render`
  <style id="app-style">
    :root {
      --text-color: #555;
      --background-color: #f0f0f0;
      --bg-color-secondary: lightgrey;
      --shadow-color: #555;
      --accent-color: #4a90e2;
      --completed-color: lightgrey;
      --subtask-color: lightgrey;
      --button-active-bg: grey;
      --input-color: #eee;
      --input-bg: #303030;
      --input-focus-outline: none;
      --modal-overlay-bg: #50505030;
      --task-item-hover-bg: transparent;
      --completed-image-opacity: 1;
      --control-button-bg: #555;
      --control-button-opacity: 0.75;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --text-color: #e0e0e0;
        --background-color: #1a1a2e;
        --bg-color-secondary: #3a3a55;
        --shadow-color: rgba(0, 0, 0, 0.5);
        --accent-color: #4a90e2;
        --completed-color: #6b7280;
        --subtask-color: #9ca3af;
        --button-active-bg: var(--accent-color);
        --input-color: var(--text-color);
        --input-bg: var(--bg-color-secondary);
        --input-focus-outline: 2px solid var(--accent-color);
        --modal-overlay-bg: rgba(0, 0, 0, 0.7);
        --task-item-hover-bg: rgba(74, 144, 226, 0.1);
        --completed-image-opacity: 0.5;
        --control-button-bg: var(--accent-color);
        --control-button-opacity: 0.9;
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
