import { render } from '../../../core.js';
import { getState } from '../store/provider.js';
export const Spinner = () => render `
  <span id="status">
    ${getState().isLoading &&
    render `
        <img
          src="./spinner.svg"
          alt="spinner"
          class="spinner"
        />
      `}
  </span>
`;
