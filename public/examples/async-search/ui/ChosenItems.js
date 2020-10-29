import { render } from '../../../purity.js';
import { getState, setState } from '../app.js';
import { idIsNotEqual } from '../helpers.js';
const Item = ({ name, id }) => render `
  <li
    ::click=${() => {
    setState(({ chosenItems }) => ({
        chosenItems: chosenItems.filter(idIsNotEqual(id)),
    }));
}}
  >
    ${name}
  </li>
`;
export const ChosenItems = () => render `
  <ul id="chosen-items" class="chosen-items">
    ${getState().chosenItems.map(Item)}
  </ul>
`;