import {setState} from '../app.js'
import type {ImageSearchResponse} from './google-api.js'

export const resetInput = (): void => {
  const $form = document.getElementById('task-form') as HTMLFormElement
  $form.reset()
  $form.task.blur()
  setState(() => ({input: ''}))
}

export const normalizeQuery = (
  queries: ImageSearchResponse['queries'],
  name: keyof ImageSearchResponse['queries']
): Record<string, {startIndex: number}> | undefined => {
  const query = queries[name]
  return query && {[name]: {startIndex: query[0].startIndex}}
}
