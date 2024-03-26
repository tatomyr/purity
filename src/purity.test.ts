import {afterEach, beforeEach, describe, expect, it, vi} from "vitest"

import {init, render} from "./purity.js"
import {delay} from "./delay.js"
import type {App} from "./purity.js"

export type AnyObject = {[key: string]: any}

describe("purity", () => {
  let app: App<AnyObject>, defaultState: AnyObject
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>'
    console.warn = vi.fn()
  })
  afterEach(() => {
    document.body.innerHTML = ""
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    app = undefined
    vi.restoreAllMocks()
  })

  describe("counter app", () => {
    let CounterApp: () => string
    beforeEach(() => {
      defaultState = {title: "COUNTER", counter: 0}
      app = init(defaultState)
      CounterApp = () => render`
        <div id="root">
          <h1>${app.getState().title}</h1>
          <span id="count">${app.getState().count}</span>
        </div>
      `
    })
    it("should match default state after created", () => {
      expect(app.getState()).toEqual(defaultState)
    })
    it("should mount a component depending on the default state", () => {
      app.mount(CounterApp)
      expect(document.body.innerHTML).toEqual(CounterApp())
    })
    it("should change state after updates depending on previous state", () => {
      app.mount(CounterApp)
      app.setState(state => ({counter: state.counter + 1}))
      expect(app.getState()).toEqual({title: "COUNTER", counter: 1})
    })
  })

  it("should bind an event", async () => {
    const eventHandler = vi.fn()
    const ClickableComponent = () => render`
      <button id="root" ::click=${eventHandler}>Click Me</button>
    `
    app = init({})
    app.mount(ClickableComponent)
    // Awaiting for the eventHandler to be set in setTimeout
    await delay(0)
    expect(document.body.innerHTML).toEqual(
      `<button id="root" data-purity_flag="">Click Me</button>`
    )
    ;(document.querySelector("button#root") as HTMLElement).click()
    expect(eventHandler).toHaveBeenCalledTimes(1)
  })
  it("should bind multiple events", async () => {
    const clickHandler = vi.fn()
    const blurHandler = vi.fn()
    const ClickableComponent = () => render`
      <input type="text" id="root" ::click=${clickHandler} ::blur=${blurHandler} />
    `
    app = init({})
    app.mount(ClickableComponent)
    // Awaiting for the eventHandler to be set in setTimeout
    await delay(0)
    expect(document.body.innerHTML).toEqual(
      '<input type="text" id="root" data-purity_flag="">'
    )
    ;(document.querySelector("input#root") as HTMLElement).click()
    expect(clickHandler).toHaveBeenCalledTimes(1)
    ;(document.querySelector("input#root") as HTMLElement).focus()
    ;(document.querySelector("input#root") as HTMLElement).blur()
    expect(blurHandler).toHaveBeenCalledTimes(1)
  })
  it(`
    should handle binding an event to element which is not a purity node
    (does not have an id defined on it)
    and ignore other data-* attributes defined on that element
  `, async () => {
    const clickHandler = vi.fn()
    const RootWithClickableElement = () => render`
      <div id="root">
        <button ::click=${clickHandler} data-other="something">
          Click Me Not a Node
        </button>
      </div>
    `
    app = init({})
    app.mount(RootWithClickableElement)
    await delay(0)
    expect(document.body.innerHTML).toEqual(
      `<div id="root"><button data-purity_flag="" data-other="something">Click Me Not a Node</button></div>`
    )
  })
  it("should add and remove components in DOM", async () => {
    const Child1 = () => render`
      <h1 id="first">First</h1>
    `
    const Child2 = () => render`
      <h2 id="second">Second</h2>
    `
    const Parent = () => {
      const {selected} = app.getState()
      return render`
        <div id="root">
          ${
            {first: Child1(), second: Child2()}[
              selected as "first" | "second"
            ] as string | undefined
          }
        </div>
      `
    }
    app = init({})
    app.mount(Parent)
    await delay(0)
    expect(document.body.innerHTML).toEqual(`<div id="root"></div>`)
    app.setState(() => ({selected: "first"}))
    await delay(0)
    expect(document.body.innerHTML).toEqual(`<div id="root">${Child1()}</div>`)
    app.setState(() => ({selected: "second"}))
    await delay(0)
    expect(document.body.innerHTML).toEqual(`<div id="root">${Child2()}</div>`)
  })
  it(`
    should handle the case when the App root id differs from a defined one in html
    or is not specified
  `, () => {
    const WrongRoot = () => render`
      <div id="wrong-root"></div>
    `
    const NoRoot = () => render`
      <div></div>
    `
    app = init({})
    expect(() => {
      app.mount(WrongRoot)
    }).toThrow(
      `Root DOM element's id does not correspond to the defined application root id "wrong-root".`
    )
    expect(() => {
      app.mount(NoRoot)
    }).toThrow(
      `Root DOM element's id does not correspond to the defined application root id "undefined".`
    )
  })
  it(`
    should not change innerHTML when only attributes have changed in the wrapper tag
    (input's value should remain the same)
  `, async () => {
    app = init({})
    const StaticComponent = () => render`
        <div id="root">
          <input id="color" style="color: ${app.getState().something};" />
          <button
            ::click=${() => {
              app.setState(() => ({
                something: (
                  document.querySelector("#color") as HTMLInputElement
                ).value,
              }))
            }}
          >
            Apply color
          </button>
        </div>
      `
    app.mount(StaticComponent)
    await delay(0)
    ;(document.querySelector("#color") as HTMLInputElement).value = "red"
    ;(document.querySelector("button") as HTMLElement).click()
    expect(
      (document.querySelector("#color") as HTMLInputElement).value
    ).toEqual("red")
    expect(
      (document.querySelector("#color") as HTMLInputElement).style.color
    ).toEqual("red")
    expect(document.body.innerHTML).toEqual(
      '<div id="root"><input style="color: red;" id="color"><button data-purity_flag="">Apply color</button></div>'
    )
  })
  it("should handle conditional rendering & process arrays", () => {
    const ConditionalComponent = ({maybeArr}: {maybeArr?: any[]}) => render`
      <div id="root">
        <ul>
          ${maybeArr?.map(item => render`<li>${item}</li>`)}
        </ul>
      </div>
    `
    app = init({})
    app.mount(() => ConditionalComponent({}))
    expect(document.body.innerHTML).toEqual(`<div id="root"><ul></ul></div>`)
    app.mount(() => ConditionalComponent({maybeArr: ["🍎", "🍌", "🍰"]}))
    expect(document.body.innerHTML).toEqual(
      `<div id="root"><ul><li>🍎</li><li>🍌</li><li>🍰</li></ul></div>`
    )
  })
})
