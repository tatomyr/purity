import {it, beforeEach, expect, describe, afterEach, vi} from "vitest"

import {ls} from "./ls.js"

describe("ls", () => {
  let storage

  beforeEach(() => {
    storage = ls("myKey")
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
    storage = null
  })

  it("writes, reads and removes data in localStorage", () => {
    const data = {name: "John", age: 25}
    storage.put(data)
    expect(storage.get()).toEqual(data)
    storage.drop()
    expect(storage.get()).toEqual({})
  })

  it("should get empty object when no data in localStorage and no default data provided", () => {
    const result = storage.get()
    expect(result).toEqual({})
  })

  it("should get default values for fields not put in localStorage", () => {
    storage.put({name: "John"})
    const result = storage.get({age: 42})
    expect(result).toEqual({name: "John", age: 42})
  })

  it("should get default values if there is some wrong data in localStorage", () => {
    localStorage.setItem("myKey", "wrong data")
    expect(storage.get({name: "John"})).toEqual({name: "John"})
    expect(storage.get()).toEqual({})
  })

  it("creates new storage wrapper", () => {
    const storage = ls("myKey")
    expect(Object.keys(storage)).toEqual(["get", "put", "drop"])
  })
})
