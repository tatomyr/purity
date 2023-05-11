import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import {mount, root} from './main.js'
import {delay} from '../../index.js'

describe('router', () => {
  beforeEach(async () => {
    console.warn = vi.fn()
    document.body.innerHTML = '<div id="root"></div>'
    mount(root)
    await delay()
  })
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('should match snapshot', () => {
    expect(document.querySelector('#root')?.outerHTML).toEqual(
      '<div id="root"><div>Default view</div><a href="#/alternative">Go to alvernative →</a></div>'
    )
  })
  it('should switch to alternative view and go back to default', async () => {
    ;(document.querySelector('a') as HTMLAnchorElement).click()
    // TODO: either abstract it away or or make it work without delay/onhashchange
    await delay()
    window.onhashchange()
    await delay()

    expect(document.location.hash).toEqual('#/alternative')
    expect(document.querySelector('#root')?.outerHTML).toEqual(
      '<div id="root"><div>Alternative view</div><button data-purity_flag="">← Back to default</button></div>'
    )

    document.querySelector('button')?.dispatchEvent(new Event('click'))
    window.onhashchange()

    expect(document.location.hash).toEqual('#/')
    expect(document.querySelector('#root')?.outerHTML).toEqual(
      '<div id="root"><div>Default view</div><a href="#/alternative">Go to alvernative →</a></div>'
    )
  })
})
