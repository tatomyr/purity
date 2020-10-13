import {init} from '../../src/purity.js'

export type Item = {
  id: string
  text: string
  checked: false
  justAdded?: boolean
}

export type AppState = {
  items: Item[]
  input: string
  spinner: boolean
}

export const {mount, rerender, getState, setState} = init<AppState>({
  items: [],
  input: '',
  spinner: false,
})
