import {rerender} from "./index.js"

const state: {[key: string]: unknown} = {}

export type UseState<T> = {
  get: () => T
  set: (newState: T) => void
}

export const useState =
  (id: string) =>
  <T>(initial: T): UseState<T> => {
    state[id] = state[id] || initial
    return {
      get: () => state[id] as T,
      set: (newState: T) => {
        state[id] = newState
        rerender()
      },
    }
  }
