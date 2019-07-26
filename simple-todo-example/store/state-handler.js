import { generateNextId } from '../helpers.js'

const defaultState = {
  items: [],
  input: '',
}

export const stateHandler = (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        items: [
          ...state.items,
          {
            ...action.item,
            id: generateNextId(state.items),
          },
        ],
      }
    case 'CHANGE_INPUT':
      return { input: action.input }
    case 'DELETE_ITEM':
      return { items: state.items.filter(({ id }) => id !== action.id) }
    case 'TOGGLE_ITEM':
      return {
        items: state.items.map(item =>
          item.id === action.id ? { ...item, checked: !item.checked } : item
        ),
      }
    case 'INIT':
      return state
    default:
      return null
  }
}
