// TODO: maybe we should pass dispatch & state to asyncWatcher to not create circular dependencies
import { dispatch, getState } from './provider.js'

export async function addItem(action) {
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

export async function getItems(action) {
  try {
    const items = await fetch('http://localhost:3000/items').then(res =>
      res.json()
    )
    dispatch({ type: 'POPULATE_ITEMS', items, justAdded: action.justAdded })
  } catch (err) {
    dispatch({ type: 'FAILURE', message: err.message })
  }
}

export async function toggleItem(action) {
  try {
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

export async function deleteItem(action) {
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

export function failure(action) {
  alert(action.message)
}

export function asyncWatcher(action) {
  switch (action.type) {
    case 'ADD_ITEM':
      addItem(action)
      break
    case 'GET_ITEMS':
      getItems(action)
      break
    case 'TOGGLE_ITEM':
      toggleItem(action)
      break
    case 'DELETE_ITEM':
      deleteItem(action)
      break
    case 'FAILURE':
      failure(action)
      break
  }
}
