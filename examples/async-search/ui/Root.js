import { render } from '../../../core.js'
import { debounce } from '../../../utils/debounce.js'
import { dispatch } from '../store/provider.js'
import { types } from '../types.js'
import { SuggestionsList } from './SuggestionsList.js'
import { ErrorBanner } from './ErrorBanner.js'
import { Spinner } from './Spinner.js'
import { ChosenItems } from './ChosenItems.js'

const onKeyup = debounce(e => {
  dispatch({ type: types.GET_ITEMS__STARTED, query: e.target.value })
}, 500)

export const Root = () => render`
  <div id="root">
    ${ChosenItems()}
    <input
      placeholder="Search query"
      ::keyup=${onKeyup}
    />
    ${Spinner()}
    ${SuggestionsList()}
    ${ErrorBanner()}
  </div>
`
