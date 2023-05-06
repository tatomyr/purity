import {delay} from './delay'
import {makeOnce} from './once'

describe('once', () => {
  let once: ReturnType<typeof makeOnce>
  let mockQuery: jest.Mock<Promise<void>, []>

  beforeEach(() => {
    once = makeOnce()
    mockQuery = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call the query function once', async () => {
    once('123', mockQuery)
    await delay()
    expect(mockQuery).toHaveBeenCalledTimes(1)
  })

  it('should only call the query function once with the same ID', async () => {
    Promise.all([
      once('123', mockQuery),
      once('123', mockQuery),
      once('123', mockQuery),
    ])
    await delay()
    expect(mockQuery).toHaveBeenCalledTimes(1)
  })

  it('should call the query function multiple times with different IDs', async () => {
    Promise.all([
      once('123', mockQuery),
      once('456', mockQuery),
      once('789', mockQuery),
    ])
    await delay()
    expect(mockQuery).toHaveBeenCalledTimes(3)
  })
})
