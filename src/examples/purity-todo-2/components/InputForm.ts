import {render, sanitize} from '../../../index.js'
import {setState, state} from '../app.js'
import {IMAGES} from '../config/images.js'
import {fetchImages} from '../services/images.js'
import {normalizeQuery, resetInput} from '../services/input-form.js'
import {groomTasks, prepareTask, useTasks} from '../services/tasks.js'
import type {Image} from '../app.js'
import {getJSON, saveJSON} from '../services/storage.js'

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

const createTask = async (e: Event): Promise<void> => {
  e.preventDefault()
  const $target = e.target as HTMLFormElement
  const description: string = sanitize($target.task.value)

  const tasks = useTasks.getCached().data || []
  const task = prepareTask(description)
  if (tasks.some(({id}) => id === task.id)) {
    window.alert('There is already a task with the same id in the list')
    return
  }

  resetInput()
  setState(() => ({view: 'active'}))
  useTasks.fire({
    optimisticData: [{...task, isBeingCreated: true}, ...tasks],
    mutation: async () => {
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
        await saveJSON({
          tasks: groomTasks([{...task, image}, ...(await getJSON({tasks}))]),
        })
      } catch (err) {
        console.warn('THIS SHOULD NOT HAPPEN AT ALL!')
        console.error(err)
        setState(() => ({error: err as string}))
        window.alert(state.error)
      }
    },
  })
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
