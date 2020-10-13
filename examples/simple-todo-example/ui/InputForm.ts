import {render} from '../../../core.js'
import {generateNextId} from '../helpers.js'
import {setState} from '../app.js'

export const InputForm = () => render`
  <form
    id="input-form"
    ::submit=${e => {
      e.preventDefault()
      setState(({items}) => ({
        items: [
          ...items,
          {
            text: (e.target as HTMLFormElement).text.value,
            checked: false,
            id: generateNextId(items),
          },
        ],
      }))
    }}
  >
    <input
      name="text"
      placeholder="Enter text"
      ::input=${e => {
        setState(() => ({
          input: (e.target as HTMLInputElement).value,
        }))
      }}
    />
    <button type="submit">Add</button>
    <button
      type="reset"
      ::click=${e => {
        setState(() => ({
          input: '',
        }))
      }}
    >
      Clear
    </button>
  </form>
`
