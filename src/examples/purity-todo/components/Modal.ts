import {render} from '../../../index.js'
import type {EventHandler} from '../../../purity.js'

type ModalProps = {
  title: string
  content: string
  close: EventHandler
}

// TODO: implement the possibility to add any control buttons to the top right
export const Modal = ({title, content, close}: ModalProps): string => render`
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
        <button ::click=${close}>⨯</button>
      </div>
      <div class="modal-content">${content}</div>
    </div>
  </div>
`
