export const delay = (t: number): Promise<number> =>
  ({
    then: (resolve: typeof Promise.resolve) => {
      const timeout = window.setTimeout(() => resolve(timeout), t)
    },
  } as Promise<number>)
