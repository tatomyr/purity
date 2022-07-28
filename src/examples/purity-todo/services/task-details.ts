import {setState, state} from '../app.js'
import type {Task} from '../app.js'

export const closeTaskDetails = (): void =>
  setState(() => ({taskDetailId: undefined}))

export const openTaskDetails = (taskDetailId: string) => (): void =>
  setState(() => ({taskDetailId}))

export const selectTask = (data?: Task[]): Task | undefined =>
  data?.find(({id}) => id === state.taskDetailId)
