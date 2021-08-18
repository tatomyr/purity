export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | {[key: string]: JSONValue}

export const getJSON = <D extends JSONValue>(obj: {[key: string]: D}): D => {
  const [[key, defaultValue]] = Object.entries(obj)
  return JSON.parse(window.localStorage.getItem(key) as string) || defaultValue
}

export const saveJSON = (obj: Record<string, JSONValue>): void => {
  Object.entries(obj).forEach(([key, value]) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  })
}
