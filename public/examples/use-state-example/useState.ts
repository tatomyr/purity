import { rerender } from './index.js'

let state: { [key: string]: any } = {}

export const useState = (id: string) => (initial: any) => {
  state[id] = state[id] || initial
  return {
    get: () => state[id],
    set: (newState: any) => {
      state[id] = newState
      rerender()
    },
  }
}
