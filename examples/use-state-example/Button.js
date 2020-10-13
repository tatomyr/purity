import { render } from '../../src/purity.js';
export const Button = ({ action, caption, handleClick }) => render `
  <button data-counter="${action}" ::click=${handleClick}>
    ${caption}
  </button>
`;
