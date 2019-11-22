import { mount, connect } from './store-provider.js'

const App = connect(
  ({ color }) => `
    <div id="root">
      <input
        id="color"
        style="color: ${color};"
        onkeyup="dispatch({
          type: 'CHANGE_COLOR',
          color: event.target.value
        })"
      />
    </div>
  `
)

mount(App)
