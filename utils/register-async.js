export const registerAsync = handlers => (action, dispatch, state, cb) => {
  if (handlers[action.type]) {
    handlers[action.type](action, dispatch, state)
  }
  if (cb) cb(action, state)
}
