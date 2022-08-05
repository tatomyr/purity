import {render} from '../../../index.js'
import {ITEM_DESCRIPTION, TOGGLE_BUTTON} from './TaskItem.js'

export const TaskListStyle = (): string => render`
  <style id="task-list-style">
    ol#task-list {
      padding: 3rem 0;
      width: 100%;
      max-width: 100%;
    }

    ol#task-list .task-item {
      display: flex;
      border-bottom: 1px solid lightgrey;
      height: 100%;
      min-height: 100%;
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

    ol#task-list .task-item.completed .${ITEM_DESCRIPTION} {
      color: lightgrey;
    }

    .${ITEM_DESCRIPTION} span {
      color: lightgrey;
    }

    ol#task-list .task-item > img {
      height: 3rem;
      min-height: 3rem;
      width: 3rem;
      min-width: 3rem;
      object-fit: cover;
    }

    ol#task-list .task-item.completed > img {
      filter: grayscale(1);
    }

  </style>
`
