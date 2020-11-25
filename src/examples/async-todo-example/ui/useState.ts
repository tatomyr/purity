import {rerender} from '../app.js'

export function useState(state: {[key: string]: unknown}) {
  return (changes: {[key: string]: unknown}): void => {
    Object.assign(state, changes)
    rerender()
  }
}
