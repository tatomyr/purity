import {describe, expect, it, vi} from 'vitest'

import {mount, root} from './main.js'
import {setBeforeAndAfter, simulate} from '../../../test-utils.js'

describe('colored input example', () => {
  setBeforeAndAfter({root, mount})

  it('should render initial snapshot', () => {
    expect(document.body.innerHTML).toEqual(
      '<div id="root"><input id="color" style="color: black;" data-purity_flag=""></div>'
    )
  })
  it('should change color when input changed', () => {
    const element = document.querySelector('#color') as HTMLInputElement
    simulate(element).input('red')
    expect(element.value).toEqual('red')
    expect(element.style.color).toBe('red')
  })
})
