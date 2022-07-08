import {init, makeAsync} from '../index.js'
import {Playground} from './components/Playground.js'

export type PlaygroundState = {
  code: string
  overDisplay: 'initial' | 'none'
}

export const {mount, getState, setState, rerender} = init<PlaygroundState>({
  code: '',
  overDisplay: 'none',
})

export const {useAsync} = makeAsync(rerender)

mount(Playground)
