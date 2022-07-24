import {render} from '../../../purity.js'
import {Item, setState} from '../app.js'
import {deleteItem, getItems, toggleItem} from '../api.js'

export const ListItem = ({
  id,
  text,
  checked,
  justAdded,
}: Item): string => render`
  <li
    id="${id}"
    class="${checked ? 'checked' : ''} ${justAdded ? 'highlighted' : ''}"
    title="${id}"
  >
    <input
      type="checkbox"
      ${checked ? 'checked' : ''}
      ::change=${async (e: Event) => {
        const {checked} = e.target as HTMLInputElement
        setState(() => ({spinner: true}))

        try {
          const toggledItem = await toggleItem(id, checked)

          setState(({items}) => ({
            items: items.map(item => (item.id === id ? toggledItem : item)),
          }))
        } catch (err) {
          window.alert((err as Error).message)
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
      ::click=${async () => {
        setState(() => ({spinner: true}))

        try {
          await deleteItem(id)
          const items = await getItems()
          setState(() => ({items}))
        } catch (err) {
          window.alert((err as Error).message)
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
