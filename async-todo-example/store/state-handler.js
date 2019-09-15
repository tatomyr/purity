const defaultState = {
  items: [],
  input: '',
  spinner: false,
}

export const stateHandler = (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'POPULATE_ITEMS':
      return {
        items: action.items.map(item =>
          item.id === action.justAdded ? { ...item, justAdded: true } : item
        ),
        spinner: false,
      }
    case 'CHANGE_INPUT':
      return { input: action.input }
    case 'GET_ITEMS':
    case 'ADD_ITEM':
    case 'TOGGLE_ITEM':
    case 'DELETE_ITEM':
    case 'SHOW_SPINNER':
      return { spinner: true }
    case 'UPDATE_ITEM':
      return {
        items: state.items.map(item =>
          item.id === action.item.id ? action.item : item
        ),
        spinner: false,
      }
    case 'FAILURE':
    case 'HIDE_SPINNER':
      return { spinner: false }
    case 'INIT':
      return state
    default:
      return null
  }
}
