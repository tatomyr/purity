export const registerAsync = handlers => (action, dispatch, state) => {
  if (handlers[action.type]) {
    handlers[action.type](action, dispatch, state)
  }
}
