import { connect } from '../store/provider.js'
import { ListItem } from './ListItem.js'
import { InputForm } from './InputForm.js'

export const App = connect(
  ({ items, input }) => `
    <div id="root">
      <h1 id="title">The List (${items.length})</h1>
      <ol id="list">
        ${items
          .filter(({ text }) => text.indexOf(input) !== -1)
          .map(ListItem)
          .join('')}
      </ol>
      ${InputForm({})}
    </div>
  `
)
