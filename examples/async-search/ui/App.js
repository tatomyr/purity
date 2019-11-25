// TODO: implement asynchronously searchable list (use fake responses)

import { render } from '/core.js'
import { connect, dispatch } from '../store/provider.js'
import { types } from '../types.js'
import { SuggestionsList } from './SuggestionsList.js'
import { ErrorBanner } from './ErrorBanner.js'
import { Spinner } from './Spinner.js'
import { ChosenItems } from './ChosenItems.js'

// FIXME: WHY input RERENDERS WITHOUT AN id???? That's because of data-purity_key changing!!

export const App = () => render`
  <div id="root">
    ${ChosenItems()}
    <input
      placeholder="Search query"
      ::keyup=${e => {
        dispatch({ type: types.GET_ITEMS__STARTED, query: e.target.value })
      }}
    />
    ${Spinner()}
    ${SuggestionsList()}
    ${ErrorBanner()}
  </div>
`
