export const ListItem = ({ id, text, checked, justAdded }) => `
  <li
    id="${id}"
    class="${checked ? 'checked' : ''} ${justAdded ? 'highlighted' : ''}"
    title="${id}"
  >
    <input
      type="checkbox"
      ${checked ? 'checked' : ''}
      onchange="dispatch({
        type: 'TOGGLE_ITEM',
        id: '${id}',
        checked: event.target.checked
      })"
    />
    <span>${text}</span>
    <button
      type="button"
      onclick="dispatch({ type: 'DELETE_ITEM', id: '${id}' })"
    >
      x
    </button>
  </li>
`
