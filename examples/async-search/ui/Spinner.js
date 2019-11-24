import { render } from '/index.js'
import { connect, dispatch } from '../store/provider.js'

export const Spinner = connect(
  ({ isLoading }) => render`
    <span id="status">
      ${isLoading &&
        render`
          <img
            src="/examples/async-search/spinner.svg"
            alt="spinner"
            class="spinner"
          />
        `}
    </span>
  `
)
