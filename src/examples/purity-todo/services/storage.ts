export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | {[key: string]: JSONValue}

export const retrieveJSON = <D extends JSONValue>(obj: {
  [key: string]: D
}): D => {
  const [[key, defaultValue]] = Object.entries(obj)
  try {
    return (
      JSON.parse(window.localStorage.getItem(key) as string) || defaultValue
    )
  } catch (err) {
    return defaultValue
  }
}

export const saveJSON = async <T extends Record<string, JSONValue>>(
  obj: T
): Promise<void> => {
  Object.entries(obj).forEach(([key, value]) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  })
}
