import {describe, expect, it, vi} from 'vitest'

import {setBeforeAndAfter, simulate} from '../../../test-utils.js'
import {mount, getState, root} from './main.js'

describe('counter', () => {
	setBeforeAndAfter({root, mount})

	it('should match snapshot', () => {
		expect(document.body.innerHTML).toEqual(
			'<div id="root"><h1>Counter</h1><div id="count">0</div><button id="inc" data-purity_flag="">⊕</button><button id="dec" data-purity_flag="">⊖</button><button id="reset" data-purity_flag="">⊗</button></div>'
		)
	})
	it('should increment, reset and decrement', () => {
		expect(getState().count).toBe(0)
		simulate('#inc').click()
		expect(getState().count).toBe(1)
		simulate('#reset').click()
		expect(getState().count).toBe(0)
		simulate('#dec').click()
		simulate('#dec').click()
		expect(getState().count).toBe(-2)
	})
})
