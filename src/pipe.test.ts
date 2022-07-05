import {pipe} from './pipe'

describe('pipe', () => {
  it('should pipe a value through 2 functions', () => {
    const f = (x: any) => x ** 2
    const g = (x: any) => x / 2
    const value = (Math.random() - 0.5) * 10
    expect(pipe(f, g)(value)).toEqual(g(f(value)))
  })
})
