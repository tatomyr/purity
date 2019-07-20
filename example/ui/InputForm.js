export const InputForm = () => `
  <form
    id="input-form"
    onsubmit="
      event.preventDefault()
      dispatch({
        type: 'ADD_ITEM',
        item: { text: event.target.text.value, checked: false },
      })
    "
  >
    <input
      name="text"
      placeholder="Enter text"
      onkeyup="dispatch({
        type: 'CHANGE_INPUT',
        input: event.target.value,
      })"
    />
    <button type="submit">Add</button>
    <button
      type="reset"
      onclick="dispatch({ type: 'CHANGE_INPUT', input: ''})"
    >
      Clear
    </button>
  </form>
`
