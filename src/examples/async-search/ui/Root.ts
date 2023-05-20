import {render, debounce} from '../../../index.js'
import {setState} from '../app.js'
import {fakeEndpoint} from '../helpers.js'
import {SuggestionsList} from './SuggestionsList.js'
import {ErrorBanner} from './ErrorBanner.js'
import {Spinner} from './Spinner.js'
import {ChosenItems} from './ChosenItems.js'
import type {EventHandler} from '../../../purity.js'

const handleInput: EventHandler = debounce(async e => {
  const query = e.target.value
  if (query) {
    setState(() => ({isLoading: true}))
    try {
      const items = await fakeEndpoint(query)
      setState(() => ({items}))
    } catch (err) {
      setState(() => ({error: (err as Error).message}))
    } finally {
      setState(() => ({isLoading: false}))
    }
  }
}, 500)

export const Root = (): string => render`
  <div id="root">
    ${ChosenItems()}
    <input
      placeholder="Search query"
      ::input=${handleInput}
    />
    ${Spinner()}
    ${SuggestionsList()}
    ${ErrorBanner()}
  </div>
`
