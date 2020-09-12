import { Item } from './types'

export const generateNextId = (arrOfIds: Item[]) =>
  `${
    arrOfIds.length !== 0 ? Math.max(...arrOfIds.map(({ id }) => +id)) + 1 : 1
  }`
