import {init, makeQuery} from '../../index.js'
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
  createdAt: number
  updatedAt: number
  image: Image
}

export type AppState = {
  view: ViewFilter
  input: string
  error?: string
  settingsModal: 'open' | ''
}

export const initialState: AppState = {
  view: 'active',
  input: '',
  settingsModal: '',
}

export const state = {...initialState}

export const {mount, setState, rerender} = init(state)

export const {useQuery} = makeQuery(rerender)
