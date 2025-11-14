export const makeOnce = () => {
  let latestCalledKey: string | number | undefined
  return (key: string | number, query: () => void | Promise<void>) => {
    if (latestCalledKey !== key) {
      latestCalledKey = key
      setTimeout(query)
    }
  }
}
