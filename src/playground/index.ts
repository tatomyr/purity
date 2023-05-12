import {init, makeAsync} from '../index.js'
import {playground} from './components/playground.js'

// Suppressing the main output (iframe output remains):
console.log = () => null
console.warn = () => null

export type PlaygroundState = {
  code: string
  placeOverDisplay: 'initial' | 'none'
}

export const {mount, getState, setState, rerender} = init<PlaygroundState>({
  code: '',
  placeOverDisplay: 'none',
})

export const {useAsync} = makeAsync(rerender) // TODO: replace with makeOnce()

mount(playground)
