import {init, makeAsync} from "../../index.js"
import {makeIntrospector} from "../../introspector.js"
import {get} from "./services/storage.js"
import type {QueryType} from "./services/google-api.js"

export type ViewFilter = "active" | "completed"

export type Image = {
  link: string
  queries: {
    request?: Pick<QueryType, "startIndex">
    nextPage?: Pick<QueryType, "startIndex">
    previousPage?: Pick<QueryType, "startIndex">
  }
}

export type Subtask = {
  checked: boolean
  description: string
}

export type BaseTask = {
  id: string
  description: string
  subtasks?: Subtask[]
  completed: boolean
  isImageLoading?: boolean
  createdAt: number
  updatedAt: number
  image: Image
}

export type Task = BaseTask & {tmpFlag?: boolean}

export type AppState = {
  view: ViewFilter
  input: string
  isSettingsModalOpen: boolean
  taskDetailId?: string
  tasks: Task[]
  taskListElement: HTMLElement | null
}

export const initialState: AppState = {
  view: "active",
  input: "",
  isSettingsModalOpen: false,
  tasks: get({tasks: []}).tasks,
  taskListElement: null,
}

export const state = {...initialState}

export const {mount, setState, rerender} = init(state)

export const {useAsync} = makeAsync(rerender)

// Fixes the issue with the keyboard on mobile devices.
window.visualViewport?.addEventListener("resize", () => {
  const height = window.visualViewport?.height
  document.body.style.height = document.body.style.maxHeight = height + "px"
  document.body.scrollIntoView()
})

export const theIntrospector = makeIntrospector(
  rerender,
  new URLSearchParams(location.search).has("introspect")
)
