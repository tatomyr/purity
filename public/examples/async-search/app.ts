import {init} from '../../purity.js'
import {AppState} from './types.js'

export const {mount, getState, setState} = init<AppState>({
  input: '',
  items: [],
  isLoading: false,
  error: '',
  chosenItems: [],
})
