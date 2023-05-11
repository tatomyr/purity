import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {delay} from './public/delay.js'

export const simulate = (target?: string | HTMLElement) => {
  const element = (
    typeof target === 'string' ? document.querySelector(target) : target
  ) as HTMLElement | undefined
  return {
    click: () => element!.click(),
    input: (value: string) => {
      ;(element as HTMLInputElement).value = value
      element!.dispatchEvent(new Event('input', {bubbles: true}))
    },
    navigation: () => {
      // FIXME: this should work out of the box
      window.onhashchange()
    },
  }
}

export const setBeforeAndAfter = ({
  root,
  mount,
}: {
  root: () => string
  mount: (root: () => string) => void
}) => {
  beforeAll(async () => {
    document.body.innerHTML = '<div id="root"></div>'
    mount(root)
    await delay()
  })
  beforeEach(() => {
    console.warn = vi.fn()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  afterAll(() => {
    document.body.innerHTML = ''
  })
}
