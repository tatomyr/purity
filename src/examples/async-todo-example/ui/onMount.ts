const mounted: Record<symbol, unknown> = {}

export const onMount =
  (id: symbol) =>
  (callback: () => void): void => {
    console.log("Mounted:", !!mounted[id])
    if (!mounted[id]) {
      setTimeout(() => {
        callback()
      })
      mounted[id] = true
    }
  }

export const createOnMount = () => onMount(Symbol())

// TODO: Also we can calculate {dom ids} \ {newDom ids} to get know which are mounting
