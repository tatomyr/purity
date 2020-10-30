export const delay = (t: number): Promise<void> =>
  ({
    then: (resolve: typeof Promise.resolve) => {
      setTimeout(resolve, t)
    },
  } as Promise<void>)
