import { render } from '/core.js'
import { connect, dispatch } from '../store/provider.js'
import { ListItem } from './ListItem.js'
import { createOnMount } from './onMount.js'

const onMount = createOnMount()

const mathes = input => ({ text }) => text.indexOf(input) !== -1

export const List = connect(({ items, input, spinner }) => {
  onMount(() => {
    dispatch({ type: 'GET_ITEMS' })
  })
  return render`
    <h1 id="title">The List (${items.length})</h1>
    <ol id="list">
      ${items.filter(mathes(input)).map(ListItem)}
    </ol>
  `
})
