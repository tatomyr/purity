import { connect, dispatch } from '../store/provider.js'
import { ListItem } from './ListItem.js'
import { createOnMount } from './onMount.js'

const onMount = createOnMount()

export const List = connect(({ items, input, spinner }) => {
  onMount(() => {
    dispatch({ type: 'GET_ITEMS' })
  })
  return `
    <h1 id="title">The List (${items.length})</h1>
    <ol id="list">
      ${items
        .filter(({ text }) => text.indexOf(input) !== -1)
        .map(ListItem)
        .join('')}
    </ol>
  `
})
