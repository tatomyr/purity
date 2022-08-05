import {setState, state} from '../app.js'
import type {Task} from '../app.js'
import type {EventHandler} from '../../../purity.js'

export const closeTaskDetails: EventHandler = () =>
  setState(() => ({taskDetailId: undefined}))

export const openTaskDetails: EventHandler = e => {
  const {id} = e.currentTarget.dataset
  setState(() => ({taskDetailId: id}))
}

export const selectDetailedTask = (): Task =>
  state.tasks.find(({id}) => id === state.taskDetailId)!
