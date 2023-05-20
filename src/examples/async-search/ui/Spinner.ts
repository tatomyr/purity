import {render} from '../../../purity.js'
import {getState} from '../app.js'

// FIXME: spinner. Maybe use background?

export const Spinner = () => render`
  <span id="status">
    ${
			getState().isLoading &&
			render`
        <img
          src="./spinner.svg"
          alt="spinner"
          class="spinner"
        />
      `
			// render`
			//   <div class="spinner"></div>
			// `
		}
  </span>
`
