import {render, sanitize} from '../../../index.js'
import {setState, state} from '../app.js'
import {IMAGES} from '../config/images.js'
import {fetchImages} from '../services/images.js'
import {normalizeQuery, resetInput} from '../services/input-form.js'
import {groomTasks, patchTask, postTask, useTasks} from '../services/tasks.js'
import type {Image} from '../app.js'

const InputFormStyle = () => render`
  <style id="task-form-style">
    form#task-form {
      width: 100%;
      max-width: 100%;
      height: 3rem;
      min-height: 3rem;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
    }

    form#task-form input {
      width: 100%;
      height: 100%;
      background-color: #303030;
      color: #eee;
    }

  </style>
`

export const createTask = async (e: Event): Promise<void> => {
  e.preventDefault()
  const $target = e.target as HTMLFormElement
  const description: string = sanitize($target.task.value)

  const {id} = await postTask(description)

  useTasks.fire()
  resetInput()
  setState(() => ({view: 'active'}))
  await groomTasks()

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
    await patchTask({id, image})
  } catch (err) {
    console.error(err)
    await patchTask({id, image: {link: IMAGES.BROKEN, queries: {}}})
    setState(() => ({error: err as string}))
    window.alert(state.error)
  } finally {
    useTasks.fire()
  }
}

export const InputForm = (): string => render`
  <form id="task-form" ::submit=${createTask}>
    <input
      name="task"
      ::input=${(e: Event): void => {
        setState(() => ({input: (e.target as HTMLInputElement).value}))
      }}
      value=""
      placeholder="Task description"
      autocomplete="off"
    />
  </form>
  ${InputFormStyle()}
`
