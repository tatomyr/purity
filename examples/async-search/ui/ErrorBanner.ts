import {render} from '../../../src/purity.js'
import {getState, setState} from '../app.js'

export const ErrorBanner = () => {
  const {error} = getState()
  return render`
    <div id="error-banner">
      ${
        error &&
        render`
          <pre
            class="error-banner"
            ::click=${() => {
              setState(() => ({error: ''}))
            }}
          >
            ${error}
          </pre>
        `
      }
    </div>
  `
}
