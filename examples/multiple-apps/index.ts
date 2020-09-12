import { init, render } from '../../core.js'

// App #1

const store1 = init({ text: 'Initial Text' })

const App1 = () => render`
  <form
    id="root-1"
    ::submit=${e => {
      e.preventDefault()
      store1.setState(() => ({
        text: (e.target as HTMLFormElement).text.value,
      }))
      ;(e.target as HTMLFormElement).reset()
    }}
  >
    <input name="text" />
    <button>Click Me 1</button>
    <span id="text">${store1.getState().text}</span>
  </form>
`

store1.mount(App1)

// App #2

const store2 = init({ counter: 0 })

const App2 = () => render`
  <div id="root-2">
    <span id="counter">${store2.getState().counter}</span>
    <button
      ::click=${e => {
        store2.setState(({ counter }) => ({ counter: counter + 1 }))
      }}
    >
      Click Me 2
    </button>
  </div>
`

store2.mount(App2)
