import {render} from "../../../index.js"
import {isTruthy} from "../../../purity.js"
import {state} from "../app.js"
import {ITEM_DESCRIPTION, TOGGLE_BUTTON} from "./task-item.js"
import type {AppState} from "../app.js"

const isTopScrolled = ({taskListElement}: AppState) =>
  taskListElement && taskListElement.scrollTop > 0

const isBottomScrolled = ({taskListElement}: AppState) =>
  taskListElement &&
  taskListElement.scrollTop <
    taskListElement.scrollHeight - taskListElement.clientHeight

export const taskListStyle = (): string => render`
  <style id="task-list-style">
    ol#task-list {
      overflow-y: auto;
      flex-grow: 1;
      min-height: 3rem;
      box-shadow: ${
        [
          isTopScrolled(state) &&
            "inset 0px 16px 8px -16px var(--shadow-color)",
          isBottomScrolled(state) &&
            "inset 0px -16px 8px -16px var(--shadow-color)",
        ]
          .filter(isTruthy)
          .join(",") || "none"
      };
    }

    ol#task-list .task-item {
      display: flex;
      border-bottom: 1px solid var(--bg-color-secondary);
      align-items: center;
      padding: 0;
    }

    ol#task-list .task-item .${ITEM_DESCRIPTION} {
      flex-grow: 1;
      padding: 2px 8px;
      max-height: 3rem;
      width: 100%;
      word-break: break-word;
      overflow: hidden;
    }

    .${ITEM_DESCRIPTION} .subtask-inline {
      color: var(--subtask-color);
    }

    .${ITEM_DESCRIPTION} .subtask-inline::before {
      content: "⊡";
      margin-right: 0.5rem;
      margin-left: 0.5rem;
      color: var(--subtask-color);
    }

    ol#task-list .task-item > img {
      height: 3rem;
      min-height: 3rem;
      width: 3rem;
      min-width: 3rem;
      object-fit: cover;
      z-index: -1;
    }

    ol#task-list .task-item.completed {
      .${ITEM_DESCRIPTION} {
        opacity: var(--completed-opacity);
      }

      > img {
        filter: grayscale(1);
        opacity: var(--completed-opacity);
      }
    }

    ol#task-list .task-item.stale {
    }

  </style>
`
