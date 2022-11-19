import {push, registerRouter, Switch} from './router'
import {render, init} from './purity'
import {delay} from './delay'

describe('router', () => {
  const warn = console.warn
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>'
    console.warn = jest.fn()
  })
  afterEach(() => {
    document.body.innerHTML = ''
    console.warn = warn
  })
  it('switches between different views depending on the url state', async () => {
    const App = (): string => render`
      <div id="root">
        ${Switch({
          '#/a': () => render`<a id="a" href="#/b">A</a>`,
          '#/b': () => render`<a id="b" href="#/a">B</a>`,
        })}
      </div>
    `
    const app = init({})
    registerRouter(app.rerender)
    app.mount(App)

    expect(document.location.hash).toEqual('#/')
    expect(document.getElementById('root')!.innerHTML).toEqual('')

    push('#/a')
    await delay()
    expect(document.location.hash).toEqual('#/a')
    expect(document.getElementById('root')!.innerHTML).toEqual(
      '<a id="a" href="#/b">A</a>'
    )

    push('#/b')
    expect(document.location.hash).toEqual('#/b')
    await delay()
    expect(document.getElementById('root')!.innerHTML).toEqual(
      '<a id="b" href="#/a">B</a>'
    )
  })
})
