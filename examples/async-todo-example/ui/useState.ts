import {rerender} from '../app.js'

export function useState(state: object) {
  return (changes: object) => {
    Object.assign(state, changes)
    rerender()
  }
}
