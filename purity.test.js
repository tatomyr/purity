const { createStore } = require('./__purity__.js')

const SimpleComponent = () => `<div id="root">SOMETHING</div>`
const ComplexComponent = ({ something }) =>
  `
    <div id="root">
      <h1 id="title">TITLE</h1>
      <p id="something">${something}</p>
    </div>
  `.trim()
const DymamicComponent = ({ something }) =>
  `
    <div id="root">
      <h1 id="title">TITLE</h1>
      <p id="something" title="${something}">${something}</p>
    </div>
  `.trim()
const ConditionalComponent = ({ something }) =>
  `
    <div id="root">
      ${!!something ? null : `<p id="something">${something}</p>`}
    </div>
  `.trim()

describe('purity', () => {
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
    document.body.innerHTML = '<div id=root></div>'
  })
  it('should match default state after created', () => {
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
      ({ something, style }) => `
        <h1 id="title" style="${style}">TITLE</h1>
        <p id="something">${something}</p>
      `
    )
    const CompundComponent = () => `
      <div id="root">
        ${InnerComponent({ style: 'color: red;' })}
      </div>
    `
    store.mount(CompundComponent)
    expect(document.body.innerHTML).toMatchSnapshot()
  })
})
