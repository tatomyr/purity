export const makeOnce = () => {
  const calls = new Set()
  return (id: string | number, query: () => void | Promise<void>) => {
    if (!calls.has(id)) {
      calls.add(id)
      setTimeout(query)
    }
  }
}
