import {render} from '../../../src/purity.js'
import {getState, Item, setState} from '../app.js'
import {getItems} from '../api.js'
import {ListItem} from './ListItem.js'
import {createOnMount} from './onMount.js'

const onMount = createOnMount()

const matches = (input: string) => ({text}: Item) => text.indexOf(input) !== -1

export const List = () => {
  const {items, input} = getState()

  onMount(async () => {
    // dispatch({ type: 'GET_ITEMS' })
    const items = await getItems()
    setState(() => ({items}))
  })

  return render`
    <h1 id="title">The List (${items.length})</h1>
    <ol id="list">
      ${items.filter(matches(input)).map(ListItem)}
    </ol>
  `
}
