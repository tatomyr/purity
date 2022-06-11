import {render} from '../../../index.js'
import {Task} from '../app.js'
import {IMAGES} from '../config/images.js'

export type Dataset = Pick<Task, 'id' | 'completed'>

export const withToggleButton =
  ($target: HTMLElement) => (callback: (dataset: Dataset) => void): void => {
    if ($target.className === 'toggle-button') {
      callback($target.dataset as unknown as Dataset)
    }
  }

export const TaskItem = ({description, id, completed, image}: Task): string => render`
  <li id="${id}" class="task-item ${completed && 'completed'}">
    <img
      src="${image.link}"
      srcset="${image.link}, ${IMAGES.BROKEN}"
      loading="lazy"
    />
    <div class="description">
      ${description}
    </div>
    <button
      id="toggle-${id}"
      class="toggle-button"
      data-id="${id}"
      data-completed="${completed && 'true'}"
    >
      ${completed ? '⊠' : '⊡'}
    </button>
  </li>
`
