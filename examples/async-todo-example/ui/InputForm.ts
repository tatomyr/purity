import { render } from '../../../core.js'
import { addItem, getItems } from '../store/api.js'
import { setState } from '../store/provider.js'

export const InputForm = () => render`
  <form
    id="input-form"
    ::submit=${async e => {
      e.preventDefault()
      // dispatch({ type: 'ADD_ITEM', text: e.target.text.value })
      setState(() => ({ spinner: true }))
      // ...
      const text = (e.target as HTMLFormElement).text.value

      try {
        const justAddedItem = await addItem(text)

        // dispatch({ type: 'GET_ITEMS', justAdded: item.id })
        const items = await getItems()
        // await fetch('http://localhost:3000/items').then(res =>
        //   res.json()
        // )

        setState(() => ({
          items: items.map(item =>
            item.id === justAddedItem.id ? { ...item, justAdded: true } : item
          ),
          // spinner: false,
        }))
        // dispatch({ type: 'POPULATE_ITEMS', items, justAdded: action.justAdded })

        // console.log('POST', item)
      } catch (err) {
        alert(err.message)
      } finally {
        setState(() => ({
          spinner: false,
        }))
      }
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
