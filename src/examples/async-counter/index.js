import {init, render, makeAsync} from '../../index.js'

// Initialization

const {mount, rerender} = init({greeting: 'Hello World!'})

const {useAsync} = makeAsync(rerender)

// Constants

const url = 'http://localhost:3000/counters/my-counter'

const myCounterOptions = {expiration: 100000}

// Hooks

const useMyCounter = useAsync(
  url,
  () => fetch(url).then(res => res.json()),
  myCounterOptions
)

const useIncMyCounter = useAsync(
  url,
  async data => {
    const {value} = await fetch(url).then(res => res.json())
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({value: value + 1}),
    })
    return await fetch(url).then(res => res.json())
  },
  myCounterOptions
)

// UI components

const App = () => {
  const {data, status, error, fire, unwrap, getCached} = useMyCounter.call({
    value: 0,
  })

  return render`
    <div id="root">
      ${FunnyWrapper('Hello Async Counter')}
      ${FunnyWrapper(render`
        <button 
          style="all: unset"
          ::click=${() => {
            useIncMyCounter.fire({
              value: (useMyCounter.getCached().data.value || 0) + 1,
            })
          }}}
        >
          ${FunnyWrapper('+')}
        </button>
        <span 
          id="my-counter" 
          style="
            padding: 0 10px; 
            ${status === 'pending' && render`color: lightgray;`}
          "
        >
          ${data?.value}
        </span>
        <span id="loader" style="margin: 0 4px;">${
          status === 'pending' && '💿'
        }</span>
        <span id="loader-2" style="margin: 0 4px;">${
          useIncMyCounter.getCached().status === 'pending' && '💽'
        }</span>
      `)}
      ${status === 'error' && FunnyWrapper(error)}
    </div>
  `
}

const FunnyWrapper = child => render`
  <div 
    style="
      border: 1px solid lime; 
      background: linear-gradient(#e66465, #9198e5);
      border-radius: 8px;
      margin: -1px 0;
      padding: 10px 20px;
      color: white;
      font-weight: bold;
    "
  >
    ${child}
  </div>
`

mount(App)
