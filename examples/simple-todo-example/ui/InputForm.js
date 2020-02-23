import { render } from '../../../core.js'
import { dispatch } from '../store/provider.js'

export const InputForm = () => render`
  <form
    id="input-form"
    ::submit=${e => {
      e.preventDefault()
      dispatch({ type: 'ADD_ITEM', text: e.target.text.value })
    }}
  >
    <input
      name="text"
      placeholder="Enter text"
      ::keyup=${e => {
        dispatch({ type: 'CHANGE_INPUT', input: e.target.value })
      }}
    />
    <button type="submit">Add</button>
    <button
      type="reset"
      ::click=${e => {
        dispatch({ type: 'CHANGE_INPUT', input: '' })
      }}
    >
      Clear
    </button>
  </form>
`
