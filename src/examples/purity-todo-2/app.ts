import {init, makeAsync} from '../../index.js'
import {QueryType} from './services/google-api.js'

export type ViewFilter = 'active' | 'completed'

export type Image = {
  link: string
  queries: {
    request?: Pick<QueryType, 'startIndex'>
    nextPage?: Pick<QueryType, 'startIndex'>
    previousPage?: Pick<QueryType, 'startIndex'>
  }
}

export type Task = {
  id: string
  description: string
  completed: boolean
  tmpFlag?: boolean
  isBeingCreated?: boolean
  isBeingUpdated?: boolean
  createdAt: number
  updatedAt: number
  image: Image
}

export type AppState = {
  view: ViewFilter
  input: string
  error?: string
  isSettingsModalOpen: boolean
}

export const initialState: AppState = {
  view: 'active',
  input: '',
  isSettingsModalOpen: false,
}

export const state = {...initialState}

export const {mount, setState, rerender} = init(state)

export const {useAsync} = makeAsync(rerender)
