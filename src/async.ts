import type {Rerender} from "./purity.js"

export type QueryStatus = "initial" | "pending" | "success" | "error"

export type QueryCache<T> = {
  status: QueryStatus
  data?: T
  error?: Error
  expires: number
}

export type Fire<T> = (options?: {
  optimisticData?: T
  _shouldRefetch?: boolean
  mutation?: (cache: QueryCache<T>) => Promise<void>
}) => Promise<void>

export type Unwrap<T> = () => T | Promise<T>

export type QueryMethods<T> = {
  fire: Fire<T>
  unwrap: Unwrap<T>
  getCached: () => QueryCache<T>
}

export type Call<T> = (optimisticData?: T) => QueryCache<T> & QueryMethods<T>

export type Query<T> = (optimisticData?: T) => Promise<T>

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const makeAsync = (rerender: Rerender) => {
  const caches: Record<string, QueryCache<unknown> | undefined> = {}

  const _getOrCreateCache = <T>(key: string): QueryCache<T> => {
    if (!(key in caches)) {
      console.warn(`Creating cache for [${key}] for the first time`)
      caches[key] = {status: "initial", expires: 0}
    } else {
      console.warn(`Cache for [${key}] exists:`, caches[key])
    }
    return caches[key] as QueryCache<T>
  }

  return {
    useAsync: <T>(
      key: string,
      query: Query<T>,
      {expiration = 3600000} = {}
    ): QueryMethods<T> & {call: Call<T>} => {
      const cache = _getOrCreateCache<T>(key)

      const fire: Fire<T> = async ({
        optimisticData,
        _shouldRefetch,
        mutation,
      } = {}) => {
        console.warn("🔥")
        if (cache.status === "pending") {
          console.warn("❗ Skipped 🔥 due to race condition.")
          return
        }
        try {
          if (optimisticData !== undefined) {
            cache.data = optimisticData
          }
          cache.status = "pending"
          if (!_shouldRefetch) {
            // TODO: investigate why does it fail without the IF?
            rerender()
          }
          if (mutation) {
            await mutation(cache)
          }
          cache.data = await query(optimisticData)
          cache.status = "success"
          cache.error = undefined
          cache.expires = Date.now() + expiration
        } catch (err) {
          console.error(`HERE IS THE ERROR:`, err)
          cache.status = "error"
          cache.error = err as Error
          cache.expires = Date.now() + expiration
        } finally {
          rerender()
        }
      }

      const unwrap: Unwrap<T> = () => {
        if (cache.status === "success" && Date.now() < cache.expires) {
          return cache.data as T
        } else {
          return query()
        }
      }

      const getCached = (): QueryCache<T> => cache

      const call: Call<T> = optimisticData => {
        const _shouldRefetch =
          cache.status === "initial" || Date.now() >= cache.expires
        if (_shouldRefetch) {
          console.warn(
            `Executing the query for a newly created or expired cache`
          )
          fire({optimisticData, _shouldRefetch})
        }
        return {fire, unwrap, getCached, ...cache}
      }

      return {call, fire, unwrap, getCached}
    },
  }
}
