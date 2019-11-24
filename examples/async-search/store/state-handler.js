import { types } from '../types.js'

const initialState = {
  input: '',
  items: [],
  isLoading: false,
  error: '',
  chosenItems: [],
}

export const stateHandler = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_ITEMS__STARTED:
      return { isLoading: true }
    case types.GET_ITEMS__SUCCESS:
      return { isLoading: false, items: action.items }
    case types.GET_ITEMS_CANCELLED:
      return { isLoading: false }
    case types.GET_ITEMS__FAILURE:
      return { isLoading: false, error: action.error }

    case types.CHOOSE_ITEM:
      return {
        chosenItems: [
          ...state.chosenItems,
          !state.chosenItems.some(({ id }) => id === action.id) &&
            state.items.find(({ id }) => id === action.id),
        ].filter(Boolean),
      }
    case types.REMOVE_FROM_CHOSEN:
      return {
        chosenItems: state.chosenItems.filter(({ id }) => id !== action.id),
      }

    case types.CLEAR_MESSAGE:
      return { error: '', bannerClicked: false }

    case types.INIT:
      return state
    default:
      return {}
  }
}
