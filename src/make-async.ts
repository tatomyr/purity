export type QueryStatus = 'initial' | 'pending' | 'success' | 'error'

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

type AsyncItems<T> = {
  status: QueryStatus
  data?: T | undefined
  error?: Error | undefined
  expires: number
  fire: () => Promise<void>
  unwrap: () => T | Promise<T>
}

export const makeAsync = (rerender: () => void) => {
  // eslint-disable-next-line prefer-const
  let cache: Record<string, QueryCache<unknown> | undefined> = {}

  const createEmptyCache = <T>(key: string): QueryCache<T> => {
    if (!(key in cache)) {
      console.log(`Creating cache for [${key}] for the first time`)
      cache[key] = {status: 'initial', expires: 0}
    }
    return cache[key] as QueryCache<T>
  }

  return {
    useAsync: <T>(
      key: string,
      query: () => Promise<T>,
      {expiration = 3600000} = {}
    ): AsyncItems<T> & {call: () => AsyncItems<T>} => {
      createEmptyCache<T>(key)

      const fire = async (): Promise<void> => {
        if ((cache[key] as QueryCache<T>).status === 'pending') {
          return
        }
        try {
          ;(cache[key] as QueryCache<T>).status = 'pending'
          const data = await query()
          cache[key] = {
            data,
            status: 'success',
            expires: Date.now() + expiration,
          }
        } catch (err) {
          cache[key] = {
            data: (cache[key] as QueryCache<T>).data,
            error: err as Error,
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
          Date.now() < (cache[key] as QueryCache<T>).expires
        ) {
          return (cache[key] as QueryCache<T>).data as T
        } else {
          return query()
        }
      }

      const call = () => {
        if (
          (cache[key] as QueryCache<T>).status === 'error' ||
          Date.now() >= (cache[key] as QueryCache<T>).expires
        ) {
          console.log(
            `Executing the query for a newly created or expired cache`
          )
          fire()
        }
        return {
          fire,
          unwrap,
          ...(cache[key] as QueryCache<T>),
        }
      }

      return {
        call,
        fire,
        unwrap,
        ...(cache[key] as QueryCache<T>),
      }
    },
  }
}
