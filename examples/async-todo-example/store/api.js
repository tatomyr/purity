export const getItems = () => fetch('http://localhost:3000/items').then(res => res.json());
export const addItem = text => fetch('http://localhost:3000/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, checked: false }),
}).then(res => res.json());
export const toggleItem = (id, checked) => fetch(`http://localhost:3000/items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checked }),
}).then(res => res.json());
export const deleteItem = (id) => fetch(`http://localhost:3000/items/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
}).then(res => res.json());
