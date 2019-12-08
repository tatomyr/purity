import { registerAsync } from '/utils/register-async.js'

export async function addItem(action, dispatch, state) {
  try {
    const item = await fetch('http://localhost:3000/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: action.text, checked: false }),
    }).then(res => res.json())
    dispatch({ type: 'GET_ITEMS', justAdded: item.id })
    console.log('POST', item)
  } catch (err) {
    dispatch({ type: 'FAILURE', message: err.message })
  }
}

export async function getItems(action, dispatch, state) {
  try {
    const items = await fetch('http://localhost:3000/items').then(res =>
      res.json()
    )
    dispatch({ type: 'POPULATE_ITEMS', items, justAdded: action.justAdded })
  } catch (err) {
    dispatch({ type: 'FAILURE', message: err.message })
  }
}

export async function toggleItem(action, dispatch, state) {
  try {
    console.log(action)
    const item = await fetch(`http://localhost:3000/items/${action.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checked: action.checked }),
    }).then(res => res.json())
    dispatch({ type: 'UPDATE_ITEM', item })
  } catch (err) {
    dispatch({ type: 'FAILURE', message: err.message })
  }
}

export async function deleteItem(action, dispatch, state) {
  try {
    await fetch(`http://localhost:3000/items/${action.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json())
    dispatch({ type: 'GET_ITEMS' })
  } catch (err) {
    dispatch({ type: 'FAILURE', message: err.message })
  }
}

export function failure(action, dispatch, state) {
  alert(action.message)
}

export const asyncWatcher = registerAsync({
  ADD_ITEM: addItem,
  GET_ITEMS: getItems,
  TOGGLE_ITEM: toggleItem,
  DELETE_ITEM: deleteItem,
  FAILURE: failure,
})
