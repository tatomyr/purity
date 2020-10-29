import {Item} from './app.js'

const BASE_URL = 'http://localhost:3000/items'

export const getItems = (): Promise<Item[]> =>
  fetch(BASE_URL).then(res => res.json())

export const addItem = (text: string) =>
  fetch(BASE_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({text, checked: false}),
  }).then(res => res.json())

export const toggleItem = (id: string, checked: boolean) =>
  fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({checked}),
  }).then(res => res.json())

export const deleteItem = (id: string) =>
  fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
  }).then(res => res.json())
