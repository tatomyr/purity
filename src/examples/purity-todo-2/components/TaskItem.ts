import {Component, render} from '../../../purity.js'
import {Task} from '../app.js'
import {IMAGES} from '../config/images.js'

export const TaskItem: Component<Task> = ({
  description,
  id,
  completed,
  image,
}) => render`
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
      class="toggle-button"
      data-id="${id}"
      data-completed="${completed && 'true'}"
    >
      ${completed ? '⊠' : '⊡'}
    </button>
  </li>
`
