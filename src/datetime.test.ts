import {afterEach, beforeEach, describe, expect, it, vi} from "vitest"

import {formatTime} from "./datetime.js"

describe("formatTime", () => {
  it("should throw an error if input is not a number", () => {
    expect(formatTime(NaN as any)).toBe(`Unknown time`)
    expect(formatTime(null as any)).toBe(`Unknown time`)
    expect(formatTime(undefined as any)).toBe(`Unknown time`)
    expect(formatTime("" as any)).toBe(`Unknown time`)
  })

  it("should format times less than a minute correctly", () => {
    expect(formatTime(0)).toBe("0 s")
    expect(formatTime(1000)).toBe("1 s")
    expect(formatTime(10000)).toBe("10 s")
  })

  it("should format times less than an hour correctly", () => {
    expect(formatTime(100000)).toBe("2 min")
    expect(formatTime(1000000)).toBe("17 min")
  })

  it("should format times less than a day correctly", () => {
    expect(formatTime(10000000)).toBe("3 h")
  })

  it("should format times greater than or equal to a day correctly", () => {
    expect(formatTime(100000000)).toBe("1 day(s)")
    expect(formatTime(1000000000)).toBe("12 day(s)")
  })
})
