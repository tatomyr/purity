import { createStore } from '../../core.js'
import { Root } from './Root.js'

export const { mount, rerender } = createStore()

mount(Root)
