export const delay = (t: number): Promise<number> =>
  ({
    then: (resolve: typeof Promise.resolve) => {
      const timeout: ReturnType<typeof setTimeout> = setTimeout(
        () => resolve(timeout),
        t
      )
    },
  } as Promise<number>)
