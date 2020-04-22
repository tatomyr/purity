/* eslint-disable no-undef */

const { createStore, render } = require('./__core__.js')

const delay = t => ({ then: resolve => setTimeout(resolve, t) })

const SimpleComponent = () => render`<div id="root">SOMETHING</div>`
const ComplexComponent = ({ something }) =>
  render`
    <div id="root">
      <h1 id="title">TITLE</h1>
      <p id="something">${something}</p>
    </div>
  `
const DymamicComponent = ({ something }) =>
  render`
    <div id="root">
      <h1 id="title">TITLE</h1>
      <p id="something" title="${something}">${something}</p>
    </div>
  `
const ConditionalComponent = ({ something }) =>
  render`
    <div id="root">
      ${something && render`<p id="something">${something}</p>`}
    </div>
  `

describe('core', () => {
  let store
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
    document.body.innerHTML = '<div id="root"></div>'
  })
  it('should match default state after created', () => {
    expect(store.getState()).toEqual(defaultState)
  })
  it('should not change after an unknown action', () => {
    store.dispatch({ type: 'UNKNOWN_ACTION', some: 'payload' })
    expect(store.getState()).toEqual(defaultState)
  })
  it('should mount a simple component', () => {
    store.mount(SimpleComponent)
    expect(document.body.innerHTML).toEqual(SimpleComponent())
  })
  it('should connect a component with the state', () => {
    store.mount(store.connect(ComplexComponent))
    expect(document.body.innerHTML).toEqual(
      ComplexComponent({ something: 'something' })
    )
  })
  it('should handle the state changes', () => {
    store.mount(store.connect(ComplexComponent))
    store.dispatch({ type: 'CHANGE_SOMETHING', something: 'new thing' })
    expect(store.getState()).toEqual({ something: 'new thing' })
  })
  it('should handle changes for a component with a static wrapper', () => {
    store.mount(store.connect(ComplexComponent))
    store.dispatch({ type: 'CHANGE_SOMETHING', something: 'new thing' })
    expect(document.body.innerHTML).toEqual(
      ComplexComponent({ something: 'new thing' })
    )
  })
  it('should handle changes for a component with a dynamic wrapper', () => {
    store.mount(store.connect(DymamicComponent))
    store.dispatch({ type: 'CHANGE_SOMETHING', something: 'new thing' })
    expect(document.body.innerHTML).toEqual(
      DymamicComponent({ something: 'new thing' })
    )
  })
  it('should handle a conditional component', () => {
    store.mount(store.connect(ConditionalComponent))
    store.dispatch({ type: 'CHANGE_SOMETHING', something: '' })
    expect(document.body.innerHTML).toEqual(
      ConditionalComponent({ something: '' })
    )
    store.dispatch({ type: 'CHANGE_SOMETHING', something: 'new thing' })
    expect(document.body.innerHTML).toEqual(
      ConditionalComponent({ something: 'new thing' })
    )
  })
  it('should deal with a compound component', () => {
    const InnerComponent = store.connect(
      ({ something, style }) => render`
        <h1 id="title" style="${style}">TITLE</h1>
        <p id="something">${something}</p>
      `
    )
    const CompundComponent = () => render`
      <div id="root">
        ${InnerComponent({ style: 'color: red;' })}
      </div>
    `
    store.mount(CompundComponent)
    expect(document.body.innerHTML).toMatchSnapshot()
  })
  it('should bind an event', async () => {
    let eventHandler = jest.fn()
    const ClickableComponent = () => render`
      <button id="root" ::click=${eventHandler}>Click me</button>
    `
    store.mount(ClickableComponent)
    // Awaiting for the eventHandler to be set in setTimeout
    await delay(0)
    expect(document.body.innerHTML).toMatchSnapshot()
    document.querySelector('button#root').click()
    expect(eventHandler).toHaveBeenCalled()
  })
  it('should bind multiple events', async () => {
    let clickHandler = jest.fn()
    let blurHandler = jest.fn()
    const ClickableComponent = () => render`
      <input type="text" id="root" ::click=${clickHandler} ::blur=${blurHandler} />
    `
    store.mount(ClickableComponent)
    // Awaiting for the eventHandler to be set in setTimeout
    await delay(0)
    expect(document.body.innerHTML).toMatchSnapshot()
    document.querySelector('input#root').click()
    expect(clickHandler).toHaveBeenCalled()
    document.querySelector('input#root').focus()
    document.querySelector('input#root').blur()
    expect(blurHandler).toHaveBeenCalled()
  })
  it(`
    should not change innerHTML when only attributes have changed in the wrapper tag
    (input's value should remain the same)
  `, async () => {
    const handleClick = e => {
      store.dispatch({
        type: 'CHANGE_SOMETHING',
        something: document.querySelector('#color').value,
      })
    }

    const Component = store.connect(
      ({ something }) => render`
        <div id="root">
          <input id="color" style="color: ${something};" />
          <button
            ::click=${handleClick}
          >
            Apply color
          </button>
        </div>
      `
    )
    store.mount(Component)
    await delay(0)
    document.querySelector('#color').value = 'red'
    await delay(0)
    document.querySelector('button').onclick()
    await delay(0)
    expect(document.querySelector('#color').value).toEqual('red')
    expect(document.querySelector('#color').style.color).toEqual('red')
    expect(document.body.innerHTML).toMatchSnapshot()
  })
  it('should handle conditional rendering & process arrays', () => {
    const Component = ({ maybeArr }) => render`
      <div id="root">
        <ul>
          ${!!maybeArr && maybeArr.map(item => render`<li>${item}</li>`)}
        </ul>
      </div>
    `
    store.mount(() => Component({}))
    expect(document.body.innerHTML).toMatchSnapshot()
    store.mount(() => Component({ maybeArr: ['🍎', '🍌', '🍰'] }))
    expect(document.body.innerHTML).toMatchSnapshot()
  })
})
