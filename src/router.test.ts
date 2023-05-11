import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import {push, registerRouter, Switch} from './router.js'
import {render, init} from './purity.js'
import {delay} from './delay.js'

describe('router', () => {
  const warn = console.warn
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>'
    console.warn = vi.fn()
  })
  afterEach(() => {
    document.body.innerHTML = ''
    console.warn = warn
  })
  it('switches between different views depending on the url state', async () => {
    const App = (): string => render`
      <div id="root">
        ${Switch({
          '#/a': () => render`<a href="#/b">A</a>`,
          '#/b': () => render`<a href="#/a">B</a>`,
        })}
      </div>
    `
    const app = init({})
    registerRouter(app.rerender)
    app.mount(App)

    expect(document.location.hash).toEqual('#/')
    expect(document.getElementById('root')!.innerHTML).toEqual('')

    push('#/a')
    // FIXME:
    window.onhashchange()

    expect(document.location.hash).toEqual('#/a')
    expect(document.getElementById('root')!.innerHTML).toEqual(
      '<a href="#/b">A</a>'
    )

    document.querySelector('a')?.click()
    // FIXME:
    await delay()
    window.onhashchange()

    expect(document.location.hash).toEqual('#/b')
    expect(document.getElementById('root')!.innerHTML).toEqual(
      '<a href="#/a">B</a>'
    )
  })
})
