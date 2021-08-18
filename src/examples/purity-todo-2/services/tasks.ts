import {md5} from '../../../index.js'
import {AppState, state, Task, useQuery} from '../app.js'
import {IMAGES} from '../config/images.js'
import {getJSON, saveJSON} from './storage.js'

// This is a 'hook' (it's better to name it with the 'use' prefix).
// It should be called inside a view component to get access to the fetched data...
export const useTasks = () => {
  const {data: tasks = [], ...rest} = useQuery('tasks', async () =>
    getJSON({tasks: [] as Task[]})
  )
  return {tasks, ...rest}
}

// Otherwise, to unwrap the hook you should use the 'unwrap' function inside an async function.
// In that case you no longer have to name it with the 'use' prefix
export const postTask = async (description: string): Promise<Task> => {
  const {unwrap, fire} = useTasks()
  const tasks = await unwrap()
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
  tasks.unshift(task)

  saveJSON({tasks})
  fire()
  return task
}

export const patchTask = async (
  task: Partial<Task> & Pick<Task, 'id'>
): Promise<Task> => {
  const {unwrap, fire} = useTasks()
  const tasks = await unwrap()
  const prevTask = tasks.find(({id}) => id === task.id)
  if (!prevTask) {
    throw new Error('There is no task with this id in the list')
  }
  const now = Date.now()
  Object.assign(prevTask, {...task, updatedAt: now})

  saveJSON({tasks})
  fire()
  return prevTask
}

export const removeTask = async (id: string): Promise<Task> => {
  const {unwrap, fire} = useTasks()
  const tasks = await unwrap()
  const currentTask = tasks.find(task => task.id === id)
  if (!currentTask) {
    throw new Error('There is no task with this id in the list')
  }

  saveJSON({
    tasks: tasks.filter(task => task.id !== id),
  })
  fire()
  return currentTask
}

const filterByInput = ({description}: Task) =>
  description.toLowerCase().indexOf(state.input.toLocaleLowerCase()) !== -1

const filterByStatus =
  ({view, input}: AppState) =>
  ({completed, tmpFlag}: Task) =>
    input
      ? true
      : view === 'active'
      ? !completed || (tmpFlag && completed)
      : view === 'completed'
      ? completed || (tmpFlag && !completed)
      : true

export const usePreparedTasks = () => {
  const {tasks, ...rest} = useTasks()

  return {
    ...rest,
    tasks: tasks.filter(filterByInput).filter(filterByStatus(state)),
  }
}

export const toggleTaskState = ({
  id,
  completed,
}: Pick<Task, 'id' | 'completed'>): void => {
  patchTask({id, completed: !completed, tmpFlag: true})
}

export const groomTasks = async (): Promise<void> => {
  const {unwrap, fire} = useTasks()
  const tasks = await unwrap()
  console.table(tasks)

  const groomedTasks: Task[] = tasks
    .map(({tmpFlag, ...task}) => task)
    .sort((a, b) => b.updatedAt - a.updatedAt)
  saveJSON({tasks: groomedTasks})
  fire()
}
