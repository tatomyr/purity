export const generateNextId = arrOfIds =>
  `${!!arrOfIds.length ? Math.max(...arrOfIds.map(({ id }) => +id)) + 1 : 1}`
