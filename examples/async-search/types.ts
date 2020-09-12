export type Item = {
  id: number
  name: string
}

export type State = {
  input: string
  items: Item[]
  isLoading: boolean
  error: string
  chosenItems: Item[]
}