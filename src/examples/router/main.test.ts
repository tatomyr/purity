import {describe, expect, it, vi} from 'vitest'

import {delay} from '../../index.js'
import {setBeforeAndAfter, simulate} from '../../../test-utils.js'
import {mount, root} from './main.js'

describe('router', () => {
  setBeforeAndAfter({root, mount})

  it('should match snapshot', () => {
    expect(document.querySelector('#root')?.outerHTML).toEqual(
      '<div id="root"><div>Default view</div><a href="#/alternative">Go to alvernative →</a></div>'
    )
  })
  it('should switch to alternative view and go back to default', async () => {
    simulate('a').click()
    // TODO: try to make it work without delay/onhashchange
    await delay()
    simulate().navigation()
    await delay()

    expect(document.location.hash).toEqual('#/alternative')
    expect(document.querySelector('#root')?.outerHTML).toEqual(
      '<div id="root"><div>Alternative view</div><button data-purity_flag="">← Back to default</button></div>'
    )

    simulate('button').click()
    simulate().navigation()

    expect(document.location.hash).toEqual('#/')
    expect(document.querySelector('#root')?.outerHTML).toEqual(
      '<div id="root"><div>Default view</div><a href="#/alternative">Go to alvernative →</a></div>'
    )
  })
})
