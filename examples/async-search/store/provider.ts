import { init } from '../../../core.js'
import { State } from '../types.js'

export const { mount, getState, setState } = init<State>({
  input: '',
  items: [],
  isLoading: false,
  error: '',
  chosenItems: [],
})
