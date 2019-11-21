import { rerender } from '../store/provider.js'

export function useState(state) {
  return changes => {
    Object.assign(state, changes)
    rerender()
  }
}
