export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | {[key: string]: JSONValue}

export const getJSON = async <D extends JSONValue>(obj: {[key: string]: D}): Promise<D> => {
  const [[key, defaultValue]] = Object.entries(obj)
  return JSON.parse(window.localStorage.getItem(key) as string) || defaultValue
}

export const saveJSON = async (obj: Record<string, JSONValue>): Promise<void> => {
  Object.entries(obj).forEach(([key, value]) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  })
}
