import {init, makeQuery} from '../../index.js'
import {ImageSearchResponse} from './services/google-api.js'

export type View = 'active' | 'completed'

export type Image = {
  link: string
} & Pick<ImageSearchResponse, 'queries'>

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
  view: View
  input: string
  error?: string
}

export const initialState: AppState = {
  view: 'active',
  input: '',
}

export const state = {...initialState}

export const {mount, setState, rerender} = init(state)

export const {useQuery} = makeQuery(rerender)
