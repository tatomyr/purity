// const {init, render} = require('./__purity__.js')
import {App, Component, init, render} from './purity'
import {delay} from './delay'

export type AnyObject = {[key: string]: any}

// const delay = t => ({then: resolve => setTimeout(resolve, t)})

// const SimpleComponent = () => render`<div id="root">SOMETHING</div>`
// const ComplexComponent = ({something}) =>
//   render`
//     <div id="root">
//       <h1 id="title">TITLE</h1>
//       <p id="something">${something}</p>
//     </div>
//   `
// const DymamicComponent = ({something}) =>
//   render`
//     <div id="root">
//       <h1 id="title">TITLE</h1>
//       <p id="something" title="${something}">${something}</p>
//     </div>
//   `
// const ConditionalComponent = ({something}) =>
//   render`
//     <div id="root">
//       ${something && render`<p id="something">${something}</p>`}
//     </div>
//   `

describe('purity', () => {
  let app: App<AnyObject>, defaultState: AnyObject
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>'
  })
  afterEach(() => {
    document.body.innerHTML = ''
    app = undefined
  })

  describe('counter app', () => {
    let CounterApp: Component
    beforeEach(() => {
      defaultState = {title: 'COUNTER', counter: 0}
      app = init(defaultState)
      CounterApp = () => render`
        <div id="root">
          <h1>${app.getState().title}</h1>
          <span id="count">${app.getState().count}</span>
        </div>
      `
    })
    it('should match default state after created', () => {
      expect(app.getState()).toEqual(defaultState)
    })
    it('should mount a component depending on the default state', () => {
      app.mount(CounterApp)
      expect(document.body.innerHTML).toEqual(CounterApp())
    })
    it('should change state after updates depending on previous state', () => {
      app.mount(CounterApp)
      app.setState(state => ({counter: state.counter + 1}))
      expect(app.getState()).toEqual({title: 'COUNTER', counter: 1})
    })
  })

  it('should bind an event', async () => {
    let eventHandler = jest.fn()
    const ClickableComponent = () => render`
      <button id="root" ::click=${eventHandler}>Click me</button>
    `
    // app = init({})
    app.mount(ClickableComponent)
    // Awaiting for the eventHandler to be set in setTimeout
    await delay(0)
    expect(document.body.innerHTML).toMatchSnapshot()
    // @ts-ignore
    document.querySelector('button#root').click()
    expect(eventHandler).toHaveBeenCalled()
  })
  // it('should bind multiple events', async () => {
  //   let clickHandler = jest.fn()
  //   let blurHandler = jest.fn()
  //   const ClickableComponent = () => render`
  //     <input type="text" id="root" ::click=${clickHandler} ::blur=${blurHandler} />
  //   `
  //   app.mount(ClickableComponent)
  //   // Awaiting for the eventHandler to be set in setTimeout
  //   await delay(0)
  //   expect(document.body.innerHTML).toMatchSnapshot()
  //   document.querySelector('input#root').click()
  //   expect(clickHandler).toHaveBeenCalled()
  //   document.querySelector('input#root').focus()
  //   document.querySelector('input#root').blur()
  //   expect(blurHandler).toHaveBeenCalled()
  // })

  // it('should handle changes for a component with a static wrapper', () => {
  //   app.mount(app.connect(ComplexComponent))
  //   app.dispatch({type: 'CHANGE_SOMETHING', something: 'new thing'})
  //   expect(document.body.innerHTML).toEqual(
  //     ComplexComponent({something: 'new thing'})
  //   )
  // })
  // it('should handle changes for a component with a dynamic wrapper', () => {
  //   app.mount(app.connect(DymamicComponent))
  //   app.dispatch({type: 'CHANGE_SOMETHING', something: 'new thing'})
  //   expect(document.body.innerHTML).toEqual(
  //     DymamicComponent({something: 'new thing'})
  //   )
  // })
  // it('should handle a conditional component', () => {
  //   app.mount(app.connect(ConditionalComponent))
  //   app.dispatch({type: 'CHANGE_SOMETHING', something: ''})
  //   expect(document.body.innerHTML).toEqual(
  //     ConditionalComponent({something: ''})
  //   )
  //   app.dispatch({type: 'CHANGE_SOMETHING', something: 'new thing'})
  //   expect(document.body.innerHTML).toEqual(
  //     ConditionalComponent({something: 'new thing'})
  //   )
  // })

  // it('should deal with a compound component', () => {
  //   const InnerComponent = app.connect(
  //     ({something, style}) => render`
  //       <h1 id="title" style="${style}">TITLE</h1>
  //       <p id="something">${something}</p>
  //     `
  //   )
  //   const CompundComponent = () => render`
  //     <div id="root">
  //       ${InnerComponent({style: 'color: red;'})}
  //     </div>
  //   `
  //   app.mount(CompundComponent)
  //   expect(document.body.innerHTML).toMatchSnapshot()
  // })
  // it('should bind an event', async () => {
  //   let eventHandler = jest.fn()
  //   const ClickableComponent = () => render`
  //     <button id="root" ::click=${eventHandler}>Click me</button>
  //   `
  //   app.mount(ClickableComponent)
  //   // Awaiting for the eventHandler to be set in setTimeout
  //   await delay(0)
  //   expect(document.body.innerHTML).toMatchSnapshot()
  //   document.querySelector('button#root').click()
  //   expect(eventHandler).toHaveBeenCalled()
  // })
  // it('should bind multiple events', async () => {
  //   let clickHandler = jest.fn()
  //   let blurHandler = jest.fn()
  //   const ClickableComponent = () => render`
  //     <input type="text" id="root" ::click=${clickHandler} ::blur=${blurHandler} />
  //   `
  //   app.mount(ClickableComponent)
  //   // Awaiting for the eventHandler to be set in setTimeout
  //   await delay(0)
  //   expect(document.body.innerHTML).toMatchSnapshot()
  //   document.querySelector('input#root').click()
  //   expect(clickHandler).toHaveBeenCalled()
  //   document.querySelector('input#root').focus()
  //   document.querySelector('input#root').blur()
  //   expect(blurHandler).toHaveBeenCalled()
  // })
  // it(`
  //   should not change innerHTML when only attributes have changed in the wrapper tag
  //   (input's value should remain the same)
  // `, async () => {
  //   const handleClick = e => {
  //     app.dispatch({
  //       type: 'CHANGE_SOMETHING',
  //       something: document.querySelector('#color').value,
  //     })
  //   }

  //   const Component = app.connect(
  //     ({something}) => render`
  //       <div id="root">
  //         <input id="color" style="color: ${something};" />
  //         <button
  //           ::click=${handleClick}
  //         >
  //           Apply color
  //         </button>
  //       </div>
  //     `
  //   )
  //   app.mount(Component)
  //   await delay(0)
  //   document.querySelector('#color').value = 'red'
  //   await delay(0)
  //   document.querySelector('button').onclick()
  //   await delay(0)
  //   expect(document.querySelector('#color').value).toEqual('red')
  //   expect(document.querySelector('#color').style.color).toEqual('red')
  //   expect(document.body.innerHTML).toMatchSnapshot()
  // })
  // it('should handle conditional rendering & process arrays', () => {
  //   const Component = ({maybeArr}) => render`
  //     <div id="root">
  //       <ul>
  //         ${!!maybeArr && maybeArr.map(item => render`<li>${item}</li>`)}
  //       </ul>
  //     </div>
  //   `
  //   app.mount(() => Component({}))
  //   expect(document.body.innerHTML).toMatchSnapshot()
  //   app.mount(() => Component({maybeArr: ['🍎', '🍌', '🍰']}))
  //   expect(document.body.innerHTML).toMatchSnapshot()
  // })
})
