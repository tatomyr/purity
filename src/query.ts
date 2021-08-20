export type QueryStatus = 'pending' | 'success' | 'error'

type QueryCache<T> = {
  status: QueryStatus
  data?: T
  error?: Error
  expires: number
}

export type QueryResponse<T> = QueryCache<T> & {
  fire: () => Promise<void>
  unwrap: () => T | Promise<T>
}

export const makeQuery = (rerender: () => void) => {
  const cache: Record<string, QueryCache<unknown> | undefined> = {}
  return {
    useQuery: <T>(
      key: string,
      call: () => Promise<T>,
      {expiration = 3600000} = {}
    ): QueryResponse<T> => {
      if (!(key in cache)) {
        console.log(`Creating cache for [${key}] for the first time`)
        cache[key] = {status: 'pending', expires: 0}
      }

      const fire = async () => {
        ;(cache[key] as QueryCache<T>).status = 'pending'
        try {
          const data = await call()
          cache[key] = {
            data,
            status: 'success',
            expires: Date.now() + expiration,
          }
        } catch (err) {
          cache[key] = {
            data: (cache[key] as QueryCache<T>).data,
            error: err,
            status: 'error',
            expires: Date.now() + expiration,
          }
        } finally {
          rerender()
        }
      }

      const unwrap = (): T | Promise<T> => {
        if (
          (cache[key] as QueryCache<T>).status === 'success' &&
          (cache[key] as QueryCache<T>).expires > Date.now()
        ) {
          return (cache[key] as QueryCache<T>).data as T
        } else {
          return call()
        }
      }

      if ((cache[key] as QueryCache<T>).expires <= Date.now()) {
        console.log(`Executing the call for a newly created or expired cache`)
        fire()
      }

      return {...(cache[key] as QueryCache<T>), fire, unwrap}
    },
    // TODO: re-introduce useAsync as we have to track status of post/put/delete operations as well
  }
}
