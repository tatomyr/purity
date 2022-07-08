import {init, makeAsync} from '../index.js'
import {Playground} from './components/Playground.js'

export type PlaygroundState = {
  code: string
  placeOverDisplay: 'initial' | 'none'
}

export const {mount, getState, setState, rerender} = init<PlaygroundState>({
  code: '',
  placeOverDisplay: 'none',
})

export const {useAsync} = makeAsync(rerender)

mount(Playground)
