import { rerender } from './index.js'

let state = {}

export const useState = id => initial => {
  state[id] = state[id] || initial
  const setState = newState => {
    state[id] = newState
    rerender()
  }
  return { get: () => state[id], set: setState }
}
