import {setState, state} from '../app.js'
import type {Task} from '../app.js'

export const closeTaskDetails: EventListener = () =>
  setState(() => ({taskDetailId: undefined}))

export const openTaskDetails: EventListener = ({target}) => {
  const {id} = (target as HTMLElement).dataset as Pick<Task, 'id'>
  setState(() => ({taskDetailId: id}))
}

export const selectDetailedTask = (): Task =>
  state.tasks.find(({id}) => id === state.taskDetailId)!
