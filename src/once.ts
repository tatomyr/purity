export const makeOnce = () => {
  let lastCalledKey: string | number | undefined
  return (key: string | number, query: () => void | Promise<void>) => {
    if (lastCalledKey !== key) {
      lastCalledKey = key
      setTimeout(query)
    }
  }
}
