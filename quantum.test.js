const { createStore } = require('./__quantum__.js')

describe('quantum', () => {
  let methods
  beforeEach(() => {
    const stateHandler = (state = {}, action = {}) => {
      switch (action.type) {
        case 'INIT':
          return state
        default:
          return {}
      }
    }
    methods = createStore(stateHandler)
  })
  it('should have connect method', () => {
    console.log(methods)
    console.log(methods.connect)
    expect(typeof methods.connect).toEqual('function')
  })
})
