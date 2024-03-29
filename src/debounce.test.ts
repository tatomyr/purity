import {afterEach, beforeEach, describe, expect, it, vi} from "vitest"

import {debounce} from "./debounce.js"
import {delay} from "./delay.js"

describe("debounce", () => {
  it("should call the callback only once (trailing)", async () => {
    const callback = vi.fn()
    const debounced = debounce(callback, 100)
    debounced()
    await delay(1)
    expect(callback).toHaveBeenCalledTimes(0)
    debounced()
    await delay(1)
    expect(callback).toHaveBeenCalledTimes(0)
    await delay(101)
    expect(callback).toHaveBeenCalledTimes(1)
  })
  it("should call the callback only once (leading)", async () => {
    const callback = vi.fn()
    const debounced = debounce(callback, -100)
    debounced()
    await delay(1)
    expect(callback).toHaveBeenCalledTimes(1)
    debounced()
    await delay()
    expect(callback).toHaveBeenCalledTimes(1)
    await delay(101)
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
