import { render } from '../../../core.js'
import { connect, dispatch } from '../store/provider.js'
import { types } from '../types.js'

export const ErrorBanner = connect(
  ({ error }) => render`
    <div id="error-banner">
      ${error &&
        render`
          <pre
            class="error-banner"
            ::click=${() => {
              dispatch({ type: types.CLEAR_MESSAGE })
            }}
          >
            ${error}
          </pre>
        `}
    </div>
  `
)
