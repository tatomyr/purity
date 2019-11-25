import { dispatch, getState } from '../store/provider.js'
import { types } from '../types.js'
import { fakeEndpoint, delay } from '../helpers.js'

async function getItems(action) {
  try {
    if (!action.query) {
      dispatch({ type: types.GET_ITEMS_CANCELLED })
      return
    }
    const items = await fakeEndpoint(action.query)
    dispatch({ type: types.GET_ITEMS__SUCCESS, items })
  } catch (err) {
    dispatch({ type: types.GET_ITEMS__FAILURE, error: err.message })
    console.error(types.GET_ITEMS__FAILURE, err.message)
  }
}

export function asyncWatcher(action) {
  console.info(action)
  switch (action.type) {
    case types.GET_ITEMS__STARTED:
      getItems(action)
      break
  }
}
