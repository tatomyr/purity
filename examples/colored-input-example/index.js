import { render } from '/core.js'
import { mount, connect, dispatch } from './store-provider.js'

const App = connect(
  ({ color }) => render`
    <div id="root">
      <input
        id="color"
        style="color: ${color};"
        ::keyup=${e =>
          dispatch({
            type: 'CHANGE_COLOR',
            color: e.target.value,
          })}
      />
    </div>
  `
)

mount(App)
