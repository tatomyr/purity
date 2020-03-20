import { render } from '../../../core.js'
import { connect, dispatch } from '../store/provider.js'

export const Spinner = connect(
  ({ isLoading }) => render`
    <span id="status">
      ${isLoading &&
        render`
          <img
            src="../spinner.svg"
            alt="spinner"
            class="spinner"
          />
        `}
    </span>
  `
)
