import type {Item} from './types.js'

export const generateNextId = (arrOfIds: Item[]): string =>
  `${arrOfIds.length !== 0 ? Math.max(...arrOfIds.map(({id}) => +id)) + 1 : 1}`
