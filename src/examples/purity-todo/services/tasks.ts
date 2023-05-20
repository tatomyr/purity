import {md5, sanitize} from '../../../index.js'
import { setState, state} from '../app.js'
import {IMAGES} from '../config/images.js'
import {put} from './storage.js'
import type {AppState, BaseTask, Task} from '../app.js'

const makeId = (description: string): string =>
  md5(description.trim().toLowerCase())

export const prepareTask = (description: string): Task => {
  const id = makeId(description)

  const now = Date.now()
  const task: Task = {
    description,
    id,
    completed: false,
    createdAt: now,
    updatedAt: now,
    image: {
      link: IMAGES.LOADING,
      queries: {},
    },
  }
  return task
}

export const patchTask = (patch: Partial<Task> & Pick<Task, 'id'>): void => {
  const now = Date.now()
  setState(({tasks}) => ({
    tasks: tasks.map(({isImageLoading, ...task}) =>
      task.id === patch.id
        ? {...task, ...patch, updatedAt: now, tmpFlag: true}
        : task
    ),
  }))
  put({tasks: groomTasks(state.tasks)})
}

export const deleteTask = (id: string): void => {
  setState(({tasks}) => ({tasks: tasks.filter(task => task.id !== id)}))
  put({tasks: groomTasks(state.tasks)})
}

export const byInput =
  ({input}: AppState) =>
  ({description}: Task): boolean =>
    description
      .trim()
      .toLowerCase()
      .indexOf(sanitize(input).trim().toLocaleLowerCase()) !== -1

export const byStatus =
  ({view, input}: AppState) =>
  ({completed, tmpFlag}: Task): boolean =>
    !!(
      input ||
      tmpFlag ||
      (view === 'active' && !completed) ||
      (view === 'completed' && completed)
    )

const toBaseTask = ({tmpFlag, ...task}: Task): BaseTask => task

export const groomTasks = (tasks: Task[]): BaseTask[] =>
  tasks.map(toBaseTask).sort((a, b) => b.updatedAt - a.updatedAt)
