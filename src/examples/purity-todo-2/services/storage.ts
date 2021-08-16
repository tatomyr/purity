export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | {[key: string]: JSONValue}

export const getJSON = <D extends JSONValue>(
  name: string,
  defaultValue: D
): D => JSON.parse(window.localStorage.getItem(name) as string) || defaultValue

export const saveJSON = (name: string, value: JSONValue): void => {
  window.localStorage.setItem(name, JSON.stringify(value))
}
