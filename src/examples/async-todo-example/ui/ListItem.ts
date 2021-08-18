import {render} from '../../../purity.js'
import {Item, setState} from '../app.js'
import {deleteItem, getItems, toggleItem} from '../api.js'

export const ListItem = ({id, text, checked, justAdded}: Item) => render`
  <li
    id="${id}"
    class="${checked ? 'checked' : ''} ${justAdded ? 'highlighted' : ''}"
    title="${id}"
  >
    <input
      type="checkbox"
      ${checked ? 'checked' : ''}
      ::change=${async e => {
        // dispatch({ type: 'TOGGLE_ITEM', id, checked })
        const {checked} = e.target as HTMLInputElement
        setState(() => ({spinner: true}))

        try {
          const toggledItem = await toggleItem(id, checked)
          // dispatch({ type: 'UPDATE_ITEM', item })

          setState(({items}) => ({
            items: items.map(item => (item.id === id ? toggledItem : item)),
            // spinner: false,
          }))
        } catch (err) {
          window.alert(err.message)
        } finally {
          setState(() => ({
            spinner: false,
          }))
        }
      }}
    />
    <span>${text}</span>
    <button
      type="button"
      ::click=${async e => {
        // dispatch({ type: 'DELETE_ITEM', id })

        setState(() => ({spinner: true}))

        try {
          await deleteItem(id)
          // dispatch({ type: 'UPDATE_ITEM', item })
          const items = await getItems()
          setState(() => ({items}))
        } catch (err) {
          window.alert(err.message)
        } finally {
          setState(() => ({
            spinner: false,
          }))
        }
      }}
    >
      x
    </button>
  </li>
`
