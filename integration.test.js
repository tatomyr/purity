const { createStore } = require('./__factory__.js')
const { htmx } = require('./__htmx__.js')

const delay = t => ({ then: resolve => setTimeout(resolve, t) })

describe('factory & htmx', () => {
  let store, Component, Connected
  beforeEach(() => {
    defaultState = {
      something: 'something',
    }
    const stateHandler = (state = defaultState, action = {}) => {
      switch (action.type) {
        case 'INIT':
          return state
        case 'CHANGE_SOMETHING':
          return { ...state, something: action.something }
        default:
          return {}
      }
    }
    store = createStore(stateHandler)
    Connected = store.connect(
      ({ title, something }) => `
        <h1>${title}</h1>
        <p>${something}</p>
      `
    )
    Component = () => htmx({ Connected })`
      <div id="root"><Connected title=${'Hello!'} /></div>
    `
    document.body.innerHTML = '<div id="root"></div>'
    store.mount(Component)
  })
  it('should render connected component properly', () => {
    expect(Component()).toMatchSnapshot()
  })
  it('should reflect state changes', () => {
    store.dispatch({ type: 'CHANGE_SOMETHING', something: 'new thing' })
    expect(Component()).toMatchSnapshot()
  })
  it('should bind an event', async () => {
    let eventHandler = jest.fn()
    const ClickableComponent = () => htmx({})`
      <button id="root" ::click=${eventHandler}>Click me</button>
    `
    store.mount(ClickableComponent)
    // Awaiting for the eventHandler to be set in setTimeout
    await delay(0)
    expect(document.body.innerHTML).toMatchSnapshot()
    document.querySelector('button#root').click()
    expect(eventHandler).toHaveBeenCalled()
  })
})
