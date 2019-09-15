export async function addItem(action, state, dispatch) {
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

export async function getItems(action, state, dispatch) {
  try {
    const items = await fetch('http://localhost:3000/items').then(res =>
      res.json()
    )
    dispatch({ type: 'POPULATE_ITEMS', items, justAdded: action.justAdded })
  } catch (err) {
    dispatch({ type: 'FAILURE', message: err.message })
  }
}

export async function toggleItem(action, state, dispatch) {
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

export async function deleteItem(action, state, dispatch) {
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

export function failure(action, state) {
  alert(action.message)
}

export function asyncWatcher(action, state, dispatch) {
  switch (action.type) {
    case 'ADD_ITEM':
      addItem(action, state, dispatch)
      break
    case 'GET_ITEMS':
      getItems(action, state, dispatch)
      break
    case 'TOGGLE_ITEM':
      toggleItem(action, state, dispatch)
      break
    case 'DELETE_ITEM':
      deleteItem(action, state, dispatch)
      break
    case 'FAILURE':
      failure(action, state)
      break
  }
}
