import {md5} from '../../../index.js'
import {AppState, state, Task, useAsync} from '../app.js'
import {IMAGES} from '../config/images.js'
import {getJSON, saveJSON} from './storage.js'

// This is a 'hook' (it's better to name it with the 'use' prefix).
// It should be called inside a view component to get access to the fetched data...
// If you need to use the cached data outside the hook, you should use the 'unwrap' function inside an async function.
// In that case you no longer have to name it with the 'use' prefix
export const useTasks = useAsync('tasks', async () =>
  getJSON({tasks: [] as Task[]})
)

export const postTask = async (description: string): Promise<Task> => {
  const tasks = await getJSON({tasks: [] as Task[]})
  const id = md5(description.trim().toLowerCase())
  if (tasks.some(task => task.id === id)) {
    throw new Error('There is already a task with the same id in the list')
  }
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

  await saveJSON({tasks: [task, ...tasks]})
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

export const byInput = ({description}: Task): boolean =>
  description.toLowerCase().indexOf(state.input.toLocaleLowerCase()) !== -1

export const byStatus =
  ({view, input}: AppState) =>
  ({completed, tmpFlag}: Task): boolean =>
    !!(input
      ? true
      : view === 'active'
      ? !completed || (tmpFlag && completed)
      : view === 'completed'
      ? completed || (tmpFlag && !completed)
      : true)

export const groomTasks = async (): Promise<void> => {
  const tasks = await getJSON({tasks: [] as Task[]})
  const groomedTasks: Task[] = tasks
    .map(({tmpFlag, ...task}) => task)
    .sort((a, b) => b.updatedAt - a.updatedAt)
  await saveJSON({tasks: groomedTasks})
  setTimeout(useTasks.fire)
}
