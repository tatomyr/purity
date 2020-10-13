import { render } from '../../../src/purity.js';
import { idEquals } from '../helpers.js';
import { getState, setState } from '../app.js';
const Item = ({ name, id }) => render `
  <li
    ::click=${() => {
    setState(({ items, chosenItems }) => ({
        chosenItems: [
            ...chosenItems,
            !chosenItems.some(idEquals(id)) && items.find(idEquals(id)),
        ].filter(Boolean),
    }));
}}
  >
    ${name}
  </li>
`;
export const SuggestionsList = () => render `
  <ul id="list">
    ${getState().items.map(Item)}
  </ul>
`;
