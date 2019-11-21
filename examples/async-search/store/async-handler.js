import { types } from '../types.js'
import { fakeEndpoint } from '../helpers.js'

async function getItems(action, state, dispatch) {
  try {
    console.log(action)
    const items = await fakeEndpoint(action.query)
    console.log(items)
    dispatch({ type: types.GET_ITEMS__SUCCESS, items })
  } catch (err) {
    dispatch({ type: types.GET_ITEMS__FAILURE })
    console.warn(types.GET_ITEMS__FAILURE, err.message)
  }
}

export function asyncWatcher(action, state, dispatch) {
  switch (action.type) {
    case types.GET_ITEMS__STARTED:
      getItems(action, state, dispatch)
      break
  }
}
