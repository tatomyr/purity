import {afterEach, beforeEach, describe, expect, it, vi} from "vitest"

import {pipe} from "./pipe.js"

describe("pipe", () => {
	it("should pipe a value through 2 functions (random values)", () => {
		const f = (x: number) => x ** 2
		const g = (x: number) => x / 2
		const value = (Math.random() - 0.5) * 10
		expect(pipe(f, g)(value)).toEqual(g(f(value)))
	})
	it("should pipe a value through 2 functions (defined values)", () => {
		const u = (s: string) => s.length
		const v = (x: number) => x ** 2
		expect(pipe(u, v)("test")).toEqual(v(u("test")))
	})
})
