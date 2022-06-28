export const codeSample = `import {init, render} from 'https://tatomyr.github.io/purity/index.js'

const {mount, getState, setState} = init({count: 0})

const App = () => render\`
  <div id="root">
    <div id="counter">Counter: \${getState().count}</div>
    <button 
      ::click=\${() => setState(({count}) => ({count: count + 1}))}
    >
      Increment
    </button>
  </div>
\`

mount(App)
`
