import {sanitize} from '../../../index.js'
import {Image, setState, state} from '../app.js'
import {IMAGES} from '../config/images.js'
import {fetchImages} from '../services/images.js'
import {groomTasks, patchTask, postTask} from '../services/tasks.js'
import {ImageSearchResponse} from './google-api.js'

export const resetInput = (): void => {
  const $form = document.getElementById('task-form') as HTMLFormElement
  $form.reset()
  $form.task.blur()
  setState(() => ({input: ''}))
}

const normalizeQuery = (
  queries: ImageSearchResponse['queries'],
  name: keyof ImageSearchResponse['queries']
) => {
  const query = queries[name]
  return query && {[name]: {startIndex: query[0].startIndex}}
}

export const createTask = async (e: Event): Promise<void> => {
  e.preventDefault()
  const $target = e.target as HTMLFormElement
  const description: string = sanitize($target.task.value)
  const task = await postTask(description)

  resetInput()
  setState(() => ({view: 'active'}))
  groomTasks()

  try {
    const {items: [{link = IMAGES.UNDEFINED_TASK}] = [{}], queries} =
      await fetchImages(description)
    const image: Image = {
      link,
      queries: {
        ...normalizeQuery(queries, 'request'),
        ...normalizeQuery(queries, 'nextPage'),
        ...normalizeQuery(queries, 'previousPage'),
      },
    }
    await patchTask({id: task.id, image})
  } catch (error) {
    console.error(error)
    await patchTask({id: task.id, image: {link: IMAGES.BROKEN, queries: {}}})
    setState(() => ({error}))
    window.alert(state.error)
  }
}
