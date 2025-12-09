import {describe, it, expect, beforeEach, vi} from "vitest"
import {state} from "../app.js"
import {type EventHandler} from "../../../purity.js"
import {closeTaskDetails} from "./task-details.js"
import * as storage from "./storage.js"
import type * as appModule from "../app.js"

vi.mock("./storage.js", () => ({
  put: vi.fn(),
  get: vi.fn(() => ({tasks: []})),
}))

vi.mock("../app.js", async () => {
  const actual = await vi.importActual<typeof appModule>("../app.js")
  return {
    ...actual,
    setState: (
      fn: (state: typeof actual.state) => Partial<typeof actual.state>
    ) => {
      const updates = fn(actual.state)
      Object.assign(actual.state, updates)
    },
  }
})

const getTestTask = (): appModule.Task => ({
  id: "test-task",
  description: "Test task",
  completed: false,
  subtasks: [],
  image: {
    link: "image.png",
    queries: {},
  },
  createdAt: 0,
  updatedAt: 0,
})

describe("closeTaskDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    state.tasks = []
    state.taskDetailId = undefined
    state.view = "active"
    state.input = ""
    state.isSettingsModalOpen = false
    state.taskListElement = null
  })

  it("should mark task as completed when all subtasks are completed", () => {
    const task = getTestTask()
    task.subtasks = [
      {description: "Subtask 1", checked: true},
      {description: "Subtask 2", checked: true},
    ]
    state.tasks = [task]
    state.taskDetailId = task.id

    closeTaskDetails({} as Parameters<EventHandler>[0])

    const updatedTask = state.tasks.find(t => t.id === task.id)
    expect(updatedTask?.completed).toBe(true)
    expect(updatedTask?.subtasks).toEqual(task.subtasks)
    expect(state.taskDetailId).toBeUndefined()
  })

  it("should mark task as not completed when not all subtasks are completed", () => {
    const task = getTestTask()
    task.subtasks = [
      {description: "Subtask 1", checked: true},
      {description: "Subtask 2", checked: false},
    ]
    state.tasks = [task]
    state.taskDetailId = task.id

    closeTaskDetails({} as Parameters<EventHandler>[0])

    const updatedTask = state.tasks.find(t => t.id === task.id)
    expect(updatedTask?.completed).toBe(false)
    expect(updatedTask?.subtasks).toEqual(task.subtasks)
    expect(state.taskDetailId).toBeUndefined()
  })

  it("should preserve task completed status when there are no subtasks", () => {
    const task = getTestTask()
    task.completed = true
    task.subtasks = []
    state.tasks = [task]
    state.taskDetailId = task.id

    closeTaskDetails({} as Parameters<EventHandler>[0])

    const updatedTask = state.tasks.find(t => t.id === task.id)
    expect(updatedTask?.completed).toBe(true)
    expect(updatedTask?.subtasks).toEqual([])
    expect(state.taskDetailId).toBeUndefined()
  })

  it("should filter out empty subtasks", () => {
    const task = getTestTask()
    task.subtasks = [
      {description: "Valid subtask", checked: true},
      {description: "", checked: false},
      {description: "Another valid", checked: true},
    ]
    state.tasks = [task]
    state.taskDetailId = task.id

    closeTaskDetails({} as Parameters<EventHandler>[0])

    const updatedTask = state.tasks.find(t => t.id === task.id)
    expect(updatedTask?.subtasks).toEqual([
      {description: "Valid subtask", checked: true},
      {description: "Another valid", checked: true},
    ])
    expect(updatedTask?.completed).toBe(true)
    expect(state.taskDetailId).toBeUndefined()
  })
})
