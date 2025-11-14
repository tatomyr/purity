import {afterEach, beforeEach, describe, expect, it, vi} from "vitest"

import {delay} from "./delay.js"
import {makeOnce} from "./once.js"

describe("once", () => {
  let once: ReturnType<typeof makeOnce>
  let mockQuery

  beforeEach(() => {
    once = makeOnce()
    mockQuery = vi.fn()
  })

  it("should only call the query function once with the same ID", async () => {
    Promise.all([
      once("123", mockQuery),
      once("123", mockQuery),
      once("123", mockQuery),
    ])
    await delay()
    expect(mockQuery).toHaveBeenCalledTimes(1)
  })

  it("should call the query function multiple times with different IDs", async () => {
    Promise.all([
      once("123", mockQuery),
      once("456", mockQuery),
      once("789", mockQuery),
    ])
    await delay()
    expect(mockQuery).toHaveBeenCalledTimes(3)
  })

  it("should call the query function again if the key changes and then changes again", async () => {
    once("123", mockQuery)
    await delay()
    expect(mockQuery).toHaveBeenCalledTimes(1)
    once("234", mockQuery)
    await delay()
    expect(mockQuery).toHaveBeenCalledTimes(2)
    once("123", mockQuery)
    await delay()
    expect(mockQuery).toHaveBeenCalledTimes(3)
  })
})
