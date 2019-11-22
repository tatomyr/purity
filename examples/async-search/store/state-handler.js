import { types } from '../types.js'

const initialState = {
  input: '',
  items: [],
  isLoading: false,
}

export const stateHandler = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_ITEMS__STARTED:
      return { isLoading: true }
    case types.GET_ITEMS__SUCCESS:
      return { isLoading: false, items: action.items }
    case types.INIT:
      return state
    default:
      return {}
  }
}
