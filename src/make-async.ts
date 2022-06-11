import type {Rerender} from './purity'

export type QueryStatus = 'initial' | 'pending' | 'success' | 'error'

type QueryCache<T> = {
  status: QueryStatus
  data?: T
  error?: Error
  expires: number
}

export type QueryResponse<T, P = void> = QueryCache<T> & {
  fire: Fire<P>
  unwrap: () => T | Promise<T>
}

export type Fire<P = void> = (payload: P) => Promise<void>

export type AsyncItems<T, P = void> = {
  status: QueryStatus
  data?: T | undefined
  error?: Error | undefined
  expires: number
  fire: Fire<P>
  unwrap: (payload: P) => T | Promise<T> // TODO: deprecate & remove?
}

export const makeAsync = (rerender: Rerender) => {
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
    useAsync: <T, P = void>(
      key: string,
      query: (payload: P) => Promise<T>,
      {expiration = 3600000} = {}
    ): AsyncItems<T, P> & {call: (payload: P) => AsyncItems<T, P>} => {
      createEmptyCache<T>(key)

      const fire = async (payload: P): Promise<void> => {
        console.log('🔥')
        if ((cache[key] as QueryCache<T>).status === 'pending') {
          console.log('❗ Skipped 🔥 due to race condition.')
          return
        }
        try {
          ;(cache[key] as QueryCache<T>).status = 'pending'
          const data = await query(payload)
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

      const unwrap = (payload: P): T | Promise<T> => {
        if (
          (cache[key] as QueryCache<T>).status === 'success' &&
          Date.now() < (cache[key] as QueryCache<T>).expires
        ) {
          return (cache[key] as QueryCache<T>).data as T
        } else {
          return query(payload)
        }
      }

      const call = (payload: P) => {
        if (
          (cache[key] as QueryCache<T>).status === 'error' ||
          Date.now() >= (cache[key] as QueryCache<T>).expires
        ) {
          console.log(
            `Executing the query for a newly created or expired cache`
          )
          fire(payload)
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
