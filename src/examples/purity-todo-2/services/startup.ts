import {rerender, Task} from '../app.js'
import {getJSON, saveJSON} from './storage.js'
import {groomTasks, useTasks} from './tasks.js'

// TODO: make use of it
export const startup = async (): Promise<void> => {
  // useTasks.fire({
  //   mutation: async () => {
  //     const tasks = await useTasks.unwrap()
  //     await saveJSON({tasks: groomTasks(tasks)})
  //   }
  // })
  const tasks = await useTasks.unwrap()
  await saveJSON({tasks: groomTasks(tasks)})
}
