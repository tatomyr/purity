import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {mount, getState, root} from './main.js'
import {delay} from '../../index.js'

describe('counter', () => {
  const warn = console.warn
  beforeEach(async () => {
    document.body.innerHTML = '<div id="root"></div>'
    console.warn = vi.fn()
    mount(root)
    await delay()
  })
  afterEach(() => {
    document.body.innerHTML = ''
    console.warn = warn
    vi.restoreAllMocks()
  })

  it('match snapshot', () => {
    expect(document.body.innerHTML).toMatchInlineSnapshot(
      '"<div id=\\"root\\"><h1>Counter</h1><div id=\\"count\\">0</div><button id=\\"inc\\" data-purity_flag=\\"\\">⊕</button><button id=\\"dec\\" data-purity_flag=\\"\\">⊖</button><button id=\\"reset\\" data-purity_flag=\\"\\">⊗</button></div>"'
    )
  })
  it('should increment', () => {
    expect(getState().count).toBe(0)
    ;(document.querySelector('#inc') as HTMLButtonElement).click()
    expect(getState().count).toBe(1)
    ;(document.querySelector('#reset') as HTMLButtonElement).click()
    expect(getState().count).toBe(0)
    ;(document.querySelector('#dec') as HTMLButtonElement).click()
    ;(document.querySelector('#dec') as HTMLButtonElement).click()
    expect(getState().count).toBe(-2)
  })
})
