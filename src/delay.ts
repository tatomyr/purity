export const delay = (t: number) => ({
  then: (resolve: typeof Promise.resolve) => setTimeout(resolve, t),
})
