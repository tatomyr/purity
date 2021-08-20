import {render} from '../../../index.js'
import {Task} from '../app.js'
import {IMAGES} from '../config/images.js'

export const TaskItem = ({description, id, completed, image}: Task) => render`
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
