import { render } from '../../../src/purity.js';
import { getState } from '../app.js';
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
