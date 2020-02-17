import { createStore, render } from '/core.js'

// App #1

const store1 = createStore((state = { text: 'Initial Text' }, action) => {
  switch (action.type) {
    case 'INIT':
      return state
    case 'CHANGE_TEXT':
      return { text: action.text }
    default:
      return {}
  }
})

const App1 = store1.connect(
  props => render`
    <form
      id="root-1"
      ::submit=${e => {
        e.preventDefault()
        store1.dispatch({ type: 'CHANGE_TEXT', text: e.target.text.value })
        e.target.text.value = ''
      }}
    >
      <input name="text" />
      <button>Click Me 1</button>
      <span id="text">${props.text}</span>
    </form>
  `
)

store1.mount(App1)

// App #2

const store2 = createStore((state = { counter: 0 }, action) => {
  switch (action.type) {
    case 'INIT':
      return state
    case 'INC':
      return { counter: state.counter + 1 }
    default:
      return {}
  }
})

const App2 = store2.connect(
  props => render`
    <div id="root-2">
      <span id="counter">${props.counter}</span>
      <button
        ::click=${e => {
          store2.dispatch({ type: 'INC' })
        }}
      >
        Click Me 2
      </button>
    </div>
  `
)

store2.mount(App2)
