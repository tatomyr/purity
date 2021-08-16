// TODO: refactor

export type FnVoid = () => void

export type QueryStatus = 'pending' | 'success' | 'error'

type QueryCache<T> = {
  status: QueryStatus
  data?: T
  error?: Error
  expires?: number
}

export type QueryResponse<T> = QueryCache<T> & {
  fire: FnVoid
  unwrap: () => T | Promise<T>
}

export const makeQuery = (rerender: FnVoid) => {
  let queryCache: Record<string, QueryCache<unknown> | undefined> = {}
  return {
    useQuery: <T>(
      key: string,
      call: () => Promise<T>,
      {expiration = 3600000} = {}
    ): QueryResponse<T> => {
      const fire: FnVoid = async () => {
        try {
          console.log('FETCH!')
          ;(queryCache[key] as QueryCache<T>).status = 'pending'
          delete (queryCache[key] as QueryCache<T>).expires
          const data = await call()
          queryCache[key] = {
            data,
            status: 'success',
            expires: Date.now() + expiration,
          }
        } catch (err) {
          queryCache[key] = {
            data: (queryCache[key] as QueryCache<T>).data,
            error: err,
            status: 'error',
          }
        } finally {
          rerender()
        }
      }

      const unwrap = (): T | Promise<T> => {
        if (queryCache[key]?.status === 'success') {
          console.log(queryCache[key])
          return (queryCache[key] as QueryCache<T>).data as T
        } else {
          return call()
        }
      }

      console.log(key, (key as string) in queryCache, {...queryCache})

      if (key in queryCache) {
        const cacheExpires = (queryCache[key] as QueryCache<T>).expires
        // TODO: refactor
        if (cacheExpires !== undefined && cacheExpires <= Date.now()) {
          fire()
        }
        return {fire, ...(queryCache[key] as QueryCache<T>), unwrap}
      } else {
        queryCache[key] = {status: 'pending'}
        fire()
        return {fire, ...(queryCache[key] as QueryCache<T>), unwrap}
      }
    },
  }
}
