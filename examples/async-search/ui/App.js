// TODO: implement asynchronously searchable list (use fake responses)

import { htmx } from '/htmx.js'
import { connect, dispatch } from '../store/provider.js'
import { types } from '../types.js'

// FIXME: WHY input RERENDERS WITHOUT AN id????

export const App = connect(
  ({ isLoading }) => htmx({})`
  <div id="root">
    <input
      id="search-query"
      placeholder="Search query"
      ::keyup=${e => {
        dispatch({ type: types.GET_ITEMS__STARTED, query: e.target.value })
      }}
    />
    <div id="status">${isLoading}</div>
  </div>
`
)
