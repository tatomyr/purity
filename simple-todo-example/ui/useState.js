import { rerender } from '../store/provider.js'

let state

export const useState = initial => {
  state = state || initial
  const setState = newState => {
    state = newState
    rerender()
  }
  return [state, setState]
}
