import { render } from '../../../core.js';
import { getState, setState } from '../store/provider.js';
export const ErrorBanner = () => {
    const { error } = getState();
    return render `
    <div id="error-banner">
      ${error &&
        render `
          <pre
            class="error-banner"
            ::click=${() => {
            setState(() => ({ error: '' }));
        }}
          >
            ${error}
          </pre>
        `}
    </div>
  `;
};
