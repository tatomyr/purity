import {render} from '../../../index.js'
import {ACTION_BUTTON} from './app-style.js'
import type {EventHandler} from '../../../purity.js'


type ModalProps = {
  title: string
  content: string
  close: EventHandler
}

export const modal = ({title, content, close}: ModalProps): string => render`
  <div
    class="modal-wrapper"
    ::click=${close}
  >
    <div
      class="modal"
      ::click=${e => e.stopPropagation()}
    >
      <div class="modal-header">
        <p>${title}</p>
        <button ::click=${close} class="${ACTION_BUTTON}">⨯</button>
      </div>
      <div class="modal-content">${content}</div>
    </div>
  </div>
`
