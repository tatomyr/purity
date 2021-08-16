import {sanitize} from '../../../index.js'
import {Image, setState, state} from '../app.js'
import {fetchImages} from '../services/images.js'
import {groomTasks, patchTask, postTask} from '../services/tasks.js'

export const resetInput = (): void => {
  const $form = document.getElementById('task-form') as HTMLFormElement
  $form.reset()
  $form.task.blur()
  setState(() => ({input: ''}))
}

export const createTask = async (e: Event): Promise<void> => {
  try {
    e.preventDefault()
    const $target = e.target as HTMLFormElement
    const description: string = sanitize($target.task.value)
    const task = await postTask(description)

    resetInput()
    setState(() => ({view: 'active'}))
    groomTasks()

    const {items: [{link}] = [], queries} = await fetchImages(description)
    const image: Image = {link, queries}
    await patchTask({id: task.id, image})
  } catch (error) {
    console.error(error)
    setState(() => ({error}))
    alert(state.error)
  }
}
