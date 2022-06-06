import {render} from '../../purity.js'

export type Actions = 'inc' | 'dec' | 'reset'

export type ButtonProps = {
  action: Actions
  caption: string
  handleClick: EventListener
}

export const Button = ({action, caption, handleClick}: ButtonProps) => render`
  <button data-counter="${action}" ::click=${handleClick}>
    ${caption}
  </button>
`
