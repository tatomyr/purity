import {afterEach, beforeEach, describe, expect, it, vi} from "vitest"

import {delay} from "./delay.js"
import {makeAsync} from "./async.js"
import type {Rerender} from "./purity.js"

describe("makeAsync", () => {
  let rerender: Rerender
  let useAsync: any
  const warn = console.warn
  const standardPayload = {
    fire: expect.any(Function),
    getCached: expect.any(Function),
    unwrap: expect.any(Function),
  }
  beforeEach(() => {
    rerender = vi.fn()
    useAsync = makeAsync(rerender).useAsync
    console.warn = vi.fn()
  })
  afterEach(() => {
    console.warn = warn
  })
  it("should contain the needed properties", () => {
    const query = vi.fn()
    const useTest = useAsync("test", query)
    expect(query).toBeCalledTimes(0)
    expect(rerender).toBeCalledTimes(0)
    expect(useTest).toEqual({
      call: expect.any(Function),
      ...standardPayload,
    })
  })
  it("should call the query", () => {
    const query = vi.fn()
    const useTest = useAsync("test", query)
    const result = useTest.call()
    expect(query).toBeCalledTimes(1)
    expect(rerender).toBeCalledTimes(0)
    expect(result).toEqual({
      expires: 0,
      status: "pending",
      ...standardPayload,
    })
  })
  it("should use existing cache", () => {
    const query = vi.fn()
    useAsync("test", query)
    useAsync("test", query)
    expect(console.warn).toBeCalledTimes(2)
    expect(console.warn).toBeCalledWith("Cache for [test] exists:", {
      expires: 0,
      status: "initial",
    })
  })
  it("should return the data on success and rerender", async () => {
    const query = () => Promise.resolve("test")
    const useTest = useAsync("test", query)
    useTest.call()
    const expires = Date.now() + 3600000
    await delay(0)
    const result2 = useTest.call()
    expect(console.warn).not.toHaveBeenCalledWith(
      "❗ Skipped 🔥 due to race condition."
    )
    expect(rerender).toBeCalledTimes(1)
    expect(result2).toEqual({
      expires,
      data: "test",
      status: "success",
      error: undefined,
      ...standardPayload,
    })
  })
  it("should getCached data", async () => {
    const query = () => Promise.resolve("test")
    const useTest = useAsync("test", query)
    expect(useTest.getCached().data).toEqual(undefined)
    expect(rerender).toBeCalledTimes(0)
    useTest.fire()
    await delay(0)
    expect(rerender).toBeCalledTimes(2)
    expect(useTest.getCached().data).toEqual("test")
  })
  it("should return an error on failure and rerender", async () => {
    const error = console.error // UTILITY
    console.error = vi.fn() // UTILITY

    const query = () => Promise.reject("err")
    const useTest = useAsync("test", query)
    // Why doesn't it work like in 'should return the data on success and rerender'??
    // const expires = Date.now() + 3600000
    useTest.call()
    await delay(0)
    const result2 = useTest.call()
    expect(console.warn).not.toHaveBeenCalledWith(
      "❗ Skipped 🔥 due to race condition."
    )
    expect(rerender).toBeCalledTimes(1)
    expect(result2).toEqual({
      expires: expect.any(Number),
      status: "error",
      error: "err",
      ...standardPayload,
    })

    console.error = error // UTILITY
  })
  it("should prevent race condition", async () => {
    const query = vi.fn()
    const useTest = useAsync("test", query)
    useTest.call()
    const result2 = useTest.call()
    expect(console.warn).toHaveBeenCalledWith(
      "❗ Skipped 🔥 due to race condition."
    )
    await delay(0)
    expect(query).toBeCalledTimes(1)
    expect(rerender).toBeCalledTimes(1)
    expect(result2).toEqual({
      expires: 0,
      status: "pending",
      ...standardPayload,
    })
  })
  it("should call mutation function", async () => {
    const query = vi.fn()
    const useTest = useAsync("test", query)
    const mutation = vi.fn()
    useTest.fire({
      mutation,
    })
    await delay(0)
    expect(mutation).toBeCalledTimes(1)
    expect(query).toBeCalledTimes(1)
    expect(rerender).toBeCalledTimes(2)
  })
  it("should pre-populate with optimisticData on call", () => {
    const query = vi.fn()
    const useTest = useAsync("test", query)
    const result = useTest.call("optimistic")
    expect(query).toBeCalledTimes(1)
    expect(rerender).toBeCalledTimes(0)
    expect(result).toEqual({
      expires: 0,
      data: "optimistic",
      status: "pending",
      ...standardPayload,
    })
  })
})
