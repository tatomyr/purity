import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {mount, root} from './main.js'
import {delay} from '../../index.js'

describe('colored input example', () => {
  // const warn = console.warn

  beforeEach(async () => {
    document.body.innerHTML = '<div id="root"></div>'
    console.warn = vi.fn()
    mount(root)
    await delay()
  })
  afterEach(() => {
    document.body.innerHTML = ''
    // console.warn = warn
    vi.restoreAllMocks()
  })

  it('should render initial snapshot', () => {
    expect(document.body.innerHTML).toEqual(
      '<div id="root"><input id="color" style="color: black;" data-purity_flag=""></div>'
    )
  })

  it('should change color when input changed', async () => {
    ;(document.getElementById('color') as HTMLInputElement).value = 'red'
    // SImalating input event TODO: extract into test-utils
    const inputEvent = new Event('input', {bubbles: true})
    ;(document.getElementById('color') as HTMLInputElement).dispatchEvent(
      inputEvent
    )
    await delay()

    expect(
      (document.getElementById('color') as HTMLInputElement).style.color
    ).toBe('red')
  })
})
