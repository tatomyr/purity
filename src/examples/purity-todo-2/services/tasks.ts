import {md5, sanitize} from '../../../index.js'
import {AppState, Task, useAsync} from '../app.js'
import {IMAGES} from '../config/images.js'
import {getJSON, saveJSON} from './storage.js'

// This is a 'hook' (it's better to name it with the 'use' prefix).
// It should be called inside a view component to get access to the fetched data...
// If you need to use the cached data outside the hook, you should use the 'unwrap' function inside an async function.
// In that case you no longer have to name it with the 'use' prefix
export const useTasks = useAsync('tasks', async () =>
  getJSON({tasks: [] as Task[]})
)

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

export const patchTask = async (
  task: Partial<Task> & Pick<Task, 'id'>
): Promise<void> => {
  const tasks = await getJSON({tasks: [] as Task[]})
  const prevTask = tasks.find(({id}) => id === task.id)
  if (!prevTask) {
    throw new Error('There is no task with this id in the list')
  }
  const now = Date.now()
  Object.assign(prevTask, {...task, updatedAt: now})

  await saveJSON({tasks})
}

export const removeTask = async (id: string): Promise<void> => {
  const tasks = await getJSON({tasks: [] as Task[]})
  const currentTask = tasks.find(task => task.id === id)
  if (!currentTask) {
    throw new Error('There is no task with this id in the list')
  }

  await saveJSON({
    tasks: tasks.filter(task => task.id !== id),
  })
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

export const groomTasks = (tasks: Task[]): Task[] =>
  tasks
    .map(({tmpFlag, ...task}) => task)
    .sort((a, b) => b.updatedAt - a.updatedAt)
