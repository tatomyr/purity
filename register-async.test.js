/* eslint-disable no-undef */

const { createStore } = require('./__core__.js')
const { registerAsync } = require('./__register-async__.js')

describe('register-async', () => {
  let store, handleAsyncFlow
  beforeEach(() => {
    handleAsyncFlow = jest.fn()
    store = createStore(
      () => ({}),
      registerAsync({
        HANDLE_ASYNC_FLOW: handleAsyncFlow,
      })
    )
  })
  it('should call async action handler', () => {
    const action = { type: 'HANDLE_ASYNC_FLOW' }
    store.dispatch(action)
    expect(handleAsyncFlow).toHaveBeenCalledWith(action, store.dispatch, {})
    expect(handleAsyncFlow).toHaveBeenCalledTimes(1)
  })
  it('should not trigger the handler if an uncnown action was dispatched', () => {
    store.dispatch({ type: 'UNKNOWN_ACTION' })
    expect(handleAsyncFlow).toHaveBeenCalledTimes(0)
  })
})
