import type {Rerender} from './purity'

export type QueryStatus = 'initial' | 'pending' | 'success' | 'error'

export type QueryCache<T> = {
  status: QueryStatus
  data?: T
  error?: Error
  expires: number
}

export type Fire<T> = (
  initialData?: T,
  shouldRefetch?: boolean
) => Promise<void>

export type Unwrap<T> = () => T | Promise<T>

export type QueryMethods<T> = {
  fire: Fire<T>
  unwrap: Unwrap<T>
  getCached: () => QueryCache<T>
}

export type Call<T> = (initialData?: T) => QueryCache<T> & QueryMethods<T>

export type Query<T> = (initialData?: T) => Promise<T>

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const makeAsync = (rerender: Rerender) => {
  const caches: Record<string, QueryCache<unknown> | undefined> = {}

  const _getOrCreateCache = <T>(key: string): QueryCache<T> => {
    if (!(key in caches)) {
      console.warn(`Creating cache for [${key}] for the first time`)
      caches[key] = {status: 'initial', expires: 0}
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

      const fire: Fire<T> = async (initialData, shouldRefetch) => {
        console.log('🔥')
        if (cache.status === 'pending') {
          console.log('❗ Skipped 🔥 due to race condition.')
          return
        }
        try {
          if (initialData) {
            cache.data = initialData
          }
          cache.status = 'pending'
          if (!shouldRefetch) { // TODO: investigate why does it fail otherwise?
            rerender()
          }
          cache.data = await query(initialData)
          cache.status = 'success'
          cache.error = undefined
          cache.expires = Date.now() + expiration
        } catch (err) {
          console.log(
            `
            HERE IS THE ERROR!!:`,
            err
          )
          cache.status = 'error'
          cache.error = err as Error
          cache.expires = Date.now() + expiration
        } finally {
          rerender()
        }
      }

      const unwrap: Unwrap<T> = () => {
        if (cache.status === 'success' && Date.now() < cache.expires) {
          return cache.data as T
        } else {
          return query()
        }
      }

      const getCached = (): QueryCache<T> => cache

      const call: Call<T> = initialData => {
        const shouldRefetch =
          cache.status === 'initial' || Date.now() >= cache.expires
        if (shouldRefetch) {
          console.log(
            `Executing the query for a newly created or expired cache`
          )
          fire(initialData, shouldRefetch)
        }
        return {fire, unwrap, getCached, ...cache}
      }

      return {call, fire, unwrap, getCached}
    },
  }
}

// https://tatomyr.github.io/purity/playground/#JYWwDg9gTgLgBAb2AO2DANHKBTZATbKAXzgDMoIQ4ByACxhjAGcAuAejZgEMZKBPKADoA5mloBXAEaDgENmHFQ0fNigIAPQQCsm1AFChIsRCC4BrbAEEmfZAGMS5SjXqN2bADYQ7XD7QhMMCwAHAAMwQCM8lIewHZsphYAtFw29tq6enYQyIEmEOLIGHDC2DAAytww2JhMZZU8NViEuATEcAC8cChoABQIwjhlKMIsNAAS2B5ecADq0B54AITURACUelk5eQjidda2Dp1wiVZpdr04OPiEG1u58Ioex3QMYO5ePn4BQQDMoQC2NlCtUoEwEnwksCioR9Pc8pYwGBjr01p0AHyIPRwODZB6IPA8Li1Kp7TCkYA4TBgHAABQgCg8jUwhQA7lAuGASF09mdDr1qCBIdDQdRMKiMVicTicDBFMgyGU7LRek81oIYLRcJdsExJTgmBkcqiNjj1oIvh5+gA3XzibBjULrHHY7G47aPOoASXsAGECjCoMdeQd7AKhVCA6LMKlDnBeoTuGiOpiEG6cXidraPPbuXAuKyuGhFTBlaqoB51ZrtQb9bqjcgTen84Xi6QlSqnpgEHBmziQGV-HgxtRaQBVAAqYt70ulWq4bVYUtn0uo-phRSSE74YGw1BHnLAsR8MFkyDYOhy+hXcCI6D7cEkEDwfDGAClygB5ABygkCSmQURSD4G07QdOBs3tOAAGo4AiZ1m3WZtZXlFsi3gdtS07Csqy1RtaxTZpDUvRs1lNW9TTdTMIA8bBBC8YQBQAJQAUVY78ABE2KSJJ0WnRNiTgQIeDJOBeR9Ox-RBW5NhlMpUOuNoAANmwAHjwYBrW6PAOgAIgoCAYF09EHwAEgQAAxQpkD4WYOSRQhelKCoqmwVERCGU9ALWIgzIQYS5T1JYOi6agelPXxqDgAAyaK4Cs5AbLsw9HMUwgVJvHFVMkcQGByGdMpxQI+FovTfA8MZCjqIyCsKlgWDsY8zA6cyJUItNCtnajaPoiBGLXAAZL1fQAaR4vjMAEkkRKYTAxOQdlOSbTrpXEv0o0IQQKRwUCc3Atl7PcyDsBguCkJWohfMKkyVvMhKkvs3coAFaDqB8h8srYHK8uQG7MtUpgwC4BUPulYAdN0iMRUIXTasy4rSt00HZyBvANMAx04NCMB1AAbjhwrzLWySNqEAK9k6EKaF3fARii2LmhuKAlOyLwoDGWJhHoQYuD4XGlKuzqkeu5G4HMgSAH5BGOwWb1UthAeBv7ZyU965Y0rTwb0rwFxh9FWvJvUQtCmn0eEN6Yri6hAF4NwB+ndWeWNeV6V1M07TtYgXWoCSAAmYzWuJqTAz-Ukjap6hTbptEGZtwBenYdtgnbUxPNL+lTfPheB7tsx7CBRZVgEWZNMTS5m3VdrTmwR7A9IfJ8oDaMYIhxoSaPBuBYgHfG664OwzEGANhw7lBsC4b2eY03AYF6ABibAADZ54AFnngBWTAZ4ATgiTfgmwVe1lxuvoDaJIOQ0vYxmCHGj5vUwoFEZAxiSZv1DgUJb5XVGzab7G359v+n8uo0WgGMVktA0DYCAdKUgOQYBJFZNgYAXMgiPhongaBws4DO3MgXRYgtHapz0CpPQIAoy9ERGADYQA
// https://tatomyr.github.io/purity/playground/#JYWwDg9gTgLgBAb2AO2DANHKBTZATbKTEAQwGtsBBAZwE9kBjAXzgDMoIQ4ByACxhhgAXAHoRAGwgMS43hGowhADgAMSgIwiwAVwBG44AxEoCADwB0AK2rcAULYYRkCxCAjbkGLIVwEoLAF44FDQACgQAcxxsGBQIoR4ACWxxSTgAdWhxPABCbiYASntHZ3gEbWoqOkZAuFIKGnoGUJwcfEIihycXbShxOCC+AWExSWlZeUUAZhVZkUcPGEJqERBaAFoFz0I7LtK62gBhd22oAHkwWO6BxDhsUzBgKBIr5ASZ2bgmYu74SjAwDdQgUBgA+RC2OBwEouBB4F4kTAKF4VTCsJ7YTAeADuzzAmAiMUOJAYvGweAAIgjahUqk1Qtw1psTksoNxMMCwRCoVCcDBesg2DFSaFeuICuYYGTkC1sNQuThqFZqE5gUUoUxiEcWYQLq9qBLxuJwgA3GTabAJFSFSFwW0w+C0gCSjGOi0IN1pjUYDKZW1Z7LgJGqDDgoXhMBIIIC4IQtqhDsQZvEFtqJGxJDQQpgIrFEqluFl8pj3iV1lVBXVPPTmfgrGFvFFfUwCDtPJ5IBicjwCW4AAUAKoAFUD8Z5ZJIfmoCTj7fb3GO2086yHtDA2G4vZIAIM0leInLyDsc6+6DHUN0EDwtASACkAMpnABy5gUUDiwFYtFN5stcGTFpwAA1HA6g2u24E8nyApBhmWb1jmjZ5pK0pFgqcrKhWVaagcbqnHqwDdOq9rdBA4jYOYkgRAyABKACi9FPhSDHrOsoKBhGiJwMi-LUFilQugweGsp0vIxDBbR+AABmOAA8eDACawR4AEABEHAQDAqmguecAACQIAAYh4yC0OkeLrlADLJKkEBwN6obCTsBTfCeBk8RUcA5AEgwhLEMjcHAABkQVwMZyCmeZ26WbK7RQDJJ5QrJujaAIThtolUIKLQ5FqTI4gJB4lRaRlmVCEIDC7mQAQGcGTRhtGsa6SeMJkRRVEMocAAyTqHAA0qx7GYJxSKRrxBJEiSZKUgiarNXOzqujqUDmOiOA-imf6hISMDEqS5JUpGwLmAB2BwAAPudcAqCCIFgVWmVME9806ZlUIGeFkUWYQDJAdwLnzbJIgpWlyCvYlsnUGAJCCvNULACpql+stqmlYl2W5apcM8tDeAKcg8TXaBKhgKYADcaOZQZi1Cctr5jZ5PmDOu+BxIFIXeHFUmOJIUAJAYET8FEJC0GTUmuW9WOZeDVNwgiAD8J2-hLJ5A1DMMyzyUkA6rClKQjamSJOhDaQZoQecWPk8Cz+MRP9wWhdwgC8G4A-Tv5EDeua0levKYbEDG1A6wAEymwgooCUt7orRbAxW9wNtsyCHPO4AvTvuyIntyRningzJ3x7C4n1md9UBAqSwDZI1nPSba8mKWjGPYGpumXlAfgJOopPcWRCNwAYnYUy3JJkFEJw9n3KDYCQgfCwpuAwKEADE2AAGwrwALCvACsmCLwAnOoe9KNgW8FGTLfQH46zPApFQJEopPnyepBQBEKAJOsnemNdT9zrjtsdxJt-IOQDf7th5tABI2JeBoGwGAnkrAnAwHWNibAwBBaKDgJebI8CpZwE1gZcu2QJYexzrYGStg3CLFCP8MARQgA
// https://tatomyr.github.io/purity/playground/#JYWwDg9gTgLgBAb2AO2DANHKBTZATbKTEAQwGtsBBAZwE9kBjAXzgDMoIQ4ByACxhhgAXAHoRAGwgMS43hGowhADgAMSgIwiwAVwBG44AxEoCADwB0AK2rcAULYYRkCxCAjbkGLIVwEoLAF44FDQACgQAcxxsGBQIoR4ACWxxSTgAdWhxPABCbiYASntHZ3gEbWoqOkZAuFIKGnoGUJwcfEIihycXbShxOCC+AWExSWlZeUUAZhVZkUcPGEJqERBaAFoFz0I7LtK62gBhd22oAHkwWO6BxDhsUzBgKBIr5AT1Wdm4JmLu+ArsABZI4nJZQG4AxqMULcNabUE7TChAoDAB8iFscG8MF6yDYMQYvFCvXEBXMMF4uBa2GoaO81Cs1CcyKKTGIIMWhAur2onRKPUqAElGMDjpzwUFIdVmrCNlswdxMCRpXBQngXiQUQF0QhMXB+WUAG4ybTYWokADuJDQ+JghOJfTJFKpOFp2vpjOZBSKWMt1vgrAJRJJmAQcD1WJAMTkeAS3AACgBVAAqivDWKxlJIfmoCV1GYz3GO20862TtDA2G4cZIYDABmkrxE1icdgLbIjcF0EDwtASACkAMpnABy5gUUDiwFYtHCxvEpoS89NcAA1HB1IU9VusTgcVA8X6bYG7cHHeTKchqW70a7PVfvbY2QcxaducBuny-nBKHWbsi6XzfVvwQdUYBITAFBeCpMFYJ5sEwDwLWeMBMAiGJDhIQlsDwAARDVagBUUESgcxxnEOcTWwBIVB3dNgOcCBxGwcxJAiGEACUAFFuJHXCePWdZUTTMCILgKCcWoRChRFDlTk6XcYlxbx2igAADTsAB48GAQ1gjwAIACIOAgGBDNRTssQAEgQAAxDxkFodIUMrKAYWSVIIB-FVXwVAofgLayEAkio4ByAJBhCWIZG4OAADI4rgezkEc5za1c6lVI0wKM003RtAEJx6JyrEFFoZijJkcQEg8SozOKkqhCEBgGzIAIbOVJpVS1HVLJK-kmJYtiYUOAAZQVDgAaUE4TMFEyDwMk6SgTksFzHQmBMOwvCNRZPqcoBYUGGI8VzDgnBKIXajVSI1bCHWjCsMpHbwORcxl2wOAAB8vrgFQUXXTcfRKrEmDB-a4AskGguS1KXMIGFV24fyIc0kR8sK5AoZKzTqDAEg8QhrFgAMwy4XlQhDIanKyoqwyiYzfG8B05B4j+jcVDAUwAG5qZKmyQrdCKeErfA4lihKVL8NTHEkKAEgMCJ+CiEhaG5tSAuh+mQexkGbNEgB+d6qM1nK0bxgndYzNSUbNnS9JJozJGzSnURs0JBYGYXuFFlmImR+LEu4QBeDcAfp38jR+2raxbTdP0p2IBdqB1gAJnM93Dtk3z7s9iLBl98WUUlkPAF6diORCjrSK907GNJ+PYXFhpz4YlVVCWAbIeqlwhsrgWO9M7WnsCMvruygPx3i58SmJJuADCjXnR6wsgohOWM55QbASGTlWdNwGBQgAYmwAA2E+ABYT4AVkwQ+AE51DvpRsCvgpudH6A-HWZ4dIqBIlC5u-HKpAoARBQAkdY6gp4qCAYFJmft3ic1MHAFOSDYEFlltABIFpeBoGwOgjMrAnAwHWBabAwAlaKC7ExPABDtaQ07DZdu2RNaRxrrYDStg3CLFCL+MARQgA
// https://tatomyr.github.io/purity/playground/#JYWwDg9gTgLgBAb2AO2DANHKBTZATbKTEAQwGtsBBAZwE9kBjAXzgDMoIQ4ByACxhhgAXAHoRAGwgMS43hGowhADgAMSgIwiwAVwBG44AxEoCADwB0AK2rcAULbFwAkqhjAZwAF4k3EZPYY-BUQQCG1kDCxCXAIoFgBeOBQ0AAoEAHMcbDdkdKEeAAlscUk4AHVocTwAQm4mAEoAoPgEbWoqOkYEuFIKGnoGFJwcfEJGhxE4AGFmkgjqJuRg7ShxOES+AWExSWlZeUUAZhUTkUDwmEJqERBaAFpziMI7W0Cl+FuZi8IAeTBfJbrRBwbCmMDAKA+YB+fLqE4nOBMeyOAoQCBkBavZpwNrYACytC+TygQNx-UYKRW4kwKXq6wAfIhbHAojAVsg2NkGLxKat6uYYLxcENsNQGVFqFZqH5aY0mMRCWFiX8AdRxm9lu0XAwCUTLiTEmTOoMqZgSMa4Ck8D4SHT4oyEMy4BqWgA3GTabDdEgAdxIaE5MG5vPE-MFwpwYvtEqlMvqjRZvv98FYXJ5puBTpZIGycjw+W4AAUAKoAFW4mCzcCFJFi1HyjpZTZ4MyeETupdoYGw3ALJDAYAM0gBImsfjszflVd0EDwtHyACkAMo-ABy5gUUBQ6WArFoaXd4k9+UPnrgAGo4OoGk6byycGyoBykwHU0H03yBULkCKo4zI7GP7xrY8o9Iq3xQCq0JLOMjjFk4zqcJAyC4DAmIunAlADkCtLio2iHvIg1owCQmAKD4bSYKwELYJg4Q+pCYCYOk2RTCQ3LYHgAAiNrdLiupKvq5h7OIB4etg+QqHecBOhqEDiNg5iSOkKTcAASgAoppq5cVpdx3PSFZwMRpFwORbLUHRWqMAJEHjPe2TslEoxQAABlWAA8eDAK6SR4PEABEHAQDAAX0lWLIACQIAAYuEyC0GUjHdlAqlFCUECYRaerPPUSLNlFCDmW0cDVPEGzJG4MjcHAABktVwHFyAJUl-YpSKLnuQVTYebo2gCH4Mndc2Ci0ApgUyOI+ThO0oVDcNLJCEIDBDmQ8TRbh0b4QtLJyQpSkQCp3BTAAMk4UwANL6YZmAmWRJEWVZ+LgcS5gsTAbEcdxNqyhFw24tqtmvdROBiUeEmWvxL1Ce9n1Ct9JG0uYp7YHAAA+aNwCodKXteCY7UwhN-Sy4U7XA0VNS1yWEKp57cHlxNwB5Ih9QNyCk8NHnUGAczzQtwD+QFtwPIJhABXzw2jeNAWM82PN4N5uSSVeKhgKYADcEsLdFxVRuVPDdvg241fVzmxK5gSSFA+QGOk-CZCQtDq65+U7TLC0c9rCAmQA-Mj4mu91zPc3MntNq5DNB95vkC4Fki1mL9Ibbr6z69whuK+k9N1Q13CALwbgD9O3UzPR2HLJeT5flxxACdQHcABMYUbQDNnQ4QG4PSV5UbBnxt0qb+eAL07xciKXnmjz5HPuUiWKEZTiXUwalrcsAVR2v+MSEF1TPRxLUvYIFf0zlAsSwmrZnyQLcAGDmmtH+xZCZEq+bXyg2AkHXDveahKQAMTYAANgAQAFgAQAVkwL-AAnOoKBShsBgPqOrI+0BYh3EhN5No+QlBq2Qd1UgUAdzIHyHcdQ58VB4IKvLTOsJVamDgPXOhlDmyW2gPkH0vA0DYGYU2VgfgYB3B9NgYAdtFBwBnFUHh7s4Bh2iivKorsS6T1sO5WwoQLgpCwmARoQA
// https://tatomyr.github.io/purity/playground/#JYWwDg9gTgLgBAb2AO2DANHKBTZATbKTEAQwGtsBBAZwE9kBjAXzgDMoIQ4ByACxhhgAXAHoRAGwgMS43hGowhADgAMSgIwiwAVwBG44AxEoCADwB0AK2rcAULbFwAkqhjAZwAF4k3EZPYY-BUQQCG1kDCxCXAIoFgBeOBQ0AAoEAHMcbDdkdKEeAAlscUk4AHVocTwAQm4mAEoAoPgEbWoqOkYEuFIKGnoGFJwcfEJGhxE4AGFmkgjqJuRg7ShxOES+AWExSWlZeUUAZhUTkUDwmEJqERBaAFpziMI7W0Cl+FuZi8IAeTBfJbrRBwbCmMDAKA+YB+fLqE7wuBMeyOAoQCBkBavZpwNrYACytC+TygQNx-UYKRW4kwKXq6wAfIhbHAojAVsg2NkGLxKat6uYYLxcENsNQGVFqFZqH5aY0mMRCWFiX8AdRxm9lu0XAwCUTLiTEmTOoMqZgSMa4Ck8D4SHT4oyEMy4BqWgA3GTabDdEgAdxIaE5MG5vPE-MFwpwYvtEqlMvqjRZvv98FYXJ5puBTpZIGycjw+W4AAUAKoAFW4mCzcCFJFi1HyjpZTZ4MyeETupdoYGw3ALJDAYAM0gBImsfjszflVd0EDwtHyACkAMo-ABy5gUUBQ6WArFoaXd4k9+UPnrgAGo4OoGk6byycGyoBykwHU0H03yBULkCKo4zI7GP7xrY8o9Iq3xQCq0JLOMjjFk4zqcJAyC4DAmIunAlADkCtLio6jgELo2jpOkhBOhhCDWjAJCYAoPhtJghAcEQbAQtgmDhD6kJgJgpEwFMJDctgeDdLiupKvq5h7OIB4etg+QqDe5FBBA4jYOYkjpJSWqMOJEHmHxAlCXgtIbtRbLUJg3AAEoAKJ2auAAi9l3Hc9IVnAVE0XAdEWYxUDMbx2RGUKJn8r5bSwZMhHEaRUBOg+7JRKMUAAAZVgAPHgwCukkeDxAARBwEAwAV9JViyAAkCAAGLhMgtBlNx3ZQCk3BFCUECYRaerPPUSLNlVtX1Y1zWECKKXpYNTYZURAh+HAFWDQotBqYVMjiPk4TtKVS3NkIQgMEOZDxNVuHRo202DRqqnqZpbVTAAMk4UwANKue5mBebR5kMTi7R6cSBnBYJoWmV5CZXc2uLaoDkmsGxslHvJlpieBQOGaDwngza5intgcAAD6E3AKh0pe16Q1DTA03tcDlVDQ11cgDVNf2LVtee3D9XTGUiHNMB+AzV0ZdQYBzItjN5YVtwPBJhAFZLjMrWtBV0824t4NluQKVeKhgKYADcStS9VEVRvEGzdvg27cHAABk9vJbEqWBJIUD5AY6T8JkJC0IbqUDYzatQ8LUPVV5AD8eNyUH0182Lcxh4NovixywD5QVki1grPkwKt2AyyQUA7sgusACwG2VZ3m+sls8Nb2vpNzDtO9wgC8G4A-Tt1AnafJ82qcSxnhXZ7EdwAEyKyrhcFaQJcoBXVf0mdMO6ejkmY8Zpm15bVsxLbdKOzw7eAL07PciInyD93AqU89NZu-RbGxMdAdtH8zrNja1L9QHfM0iNlV0wt0pIixO8OAH9Rrs0IDhbkwAqh2n-DEQgU04BZRyibPOBdCpLRnFAWIsIDY+VUhnOABgczG1wYJMgmQlT5jISgbAxc7i+2yqhFIABibAAA2bh5duEAFZMAcIAJzqBEUobAAj6iG1wdAMekJsptHyEoA2sjppz1LvkO46giEqHUYNTWTdYT61MHAcepiDHNjdtAfIPpeBoGwFYpsrA-AwDuD6bAwBvaKDgDOKoziQ70yrNVOBVQg580AeVdKthQgXBSFhMAjQgA
// https://tatomyr.github.io/purity/playground/#JYWwDg9gTgLgBAb2AO2DANHKBTZATbKTEAQwGtsBBAZwE9kBjAXzgDMoIQ4ByACxhhgAXAHoRAGwgMS43hGowhADgAMSgIwiwAVwBG44AxEoCADwB0AK2rcAULbFwAkqhjAZwAF4k3EZPYY-BUQQCG1kDCxCXAIoFgBeOBQ0AAoEAHMcbDdkdKEeAAlscUk4AHVocTwAQm4mAEoAoPgEbWoqOkYEuFIKGnoGFJwcfEJGhxE4AGFmkgjqJuRg7ShxOES+AWExSWlZeUUAZhUTkUDwmEJqERBaAFpziMI7W0Cl+FuZi8IAeTBfJbrRBwbCmMDAKA+YB+fLqE7wuBMeyOAoQCBkBavZpwNrYACytC+TygQNx-UYKRW4kwKXq6wAfHA2NkGLxKat6uYYLxcENsNQGVFqFZqH5afViISwsS-gDqOM3st2i4GASiZcSYkyZ1BlTMCQdXAUngfCQ6fFGQhbEzFS0AG4ybTYbokADuJDQzJgrPZ4k53N5OAFFqFIrF9UaTLdHvgrBZbL1wOtTJ62TkeHy3AACgBVAAq3EwyaZPJIsWo+StKZT3BmTwidzztDA2G4mZIYDABmkAJE1j8dmrTHQxbguggeFo+QAUgBlH4AOXMCigKHSwFYtDSDvETvyO6dcAA1HB1A1k+emTgYCtkHBo56496ExyuTzkHzg4yg2GPxHbMOPRSt8UCytCSzjI4OZOHAgTgH4uAwJitpwJQnZArSgpWo4BC6No6TpIQyYoQgJowCQmAKD4bSYIQHBEGwELYJg4SupCYCYIRMBTCQrLYHg3S4mq0oauYeziNujrYPkKjnsRQQQOI2DmJI6SUsqjDCSB5hcTxfF4LSy7kTe1CYNwABKACiVkLgAItZdx3PShZwGRFFwFRJm0VA9Gcdkek8gZnKeW0kGTLh+GEVAybXreUSjFAAAGo4ADx4MAdpJHg8QAEQcBAMA5fSo5MgAJAgABi4TILQZTsS2UApNwRQlBAqGGuqzz1Ei1ZlZV1W1fVhB8glyW9SmKV4QIfhwCVvUKLQSm5TI4j5OE7SFXN1ZCEIDDdmQ8TlZhIZVuNvWKopymqU1UwADJOFMADSjnOZgbmUcZNE4u0WnEjp-m8YFhluZGZ3VriKq-aJrBMZJu7SUaQnAX9umA-xwOmuYB7YHAAA+uNwCodInmeoNg0wFNbXAxVg31VXIDVdUdg1TVHtw3VUylIhTTAfg02dKXUGAcyzbTWW5bcDwiYQOWi7TC1LTlVPVsLeDpbkMmnioYCmAA3HLYvlSFwbxBsLb4Gu3BwAAZNb8WxIlgSSFA+QGOk-CZCQtC64lPW00rYP82D5VuQA-FjUl++NXNC3MQe9YLwt3sA2U5ZIZYyx5MCLdgEskFA67IJrAAsOtFUdxvrKbPDm+r6TszbdvcIAvBuAP07dQx0n8fVonIsp7l6exHcABMssK7nOWkAXKAl2X9JHRDmnI6JqP6YZlem2bMSW3Sts8M3gC9Ox3Iix8g3dwIlHPjUbn0mxsdHQFbe-04zQ2NQ-UBXxNIjpXa-PJUiLE7w4Av0GszQgGFWTACqOab8MRCBjTgGlDKBss451ynNccUBYiwh1h5RSKc4AGBANgfWmDeJkEyNKDMRCUDYHzncT26VEIpAAMTYAAGwcOLhwgArJgVhABOdQgilDYF4fUXWmDoBD0hOlNo+QlA6ykeNKehd8h3HUHglQKjeqqzrrCbWpg4DDyMbo6sTtoD5FdLwNApC5qsD8DAO4rpsDAHdooMcik8DmLgAHamo5ypQKqH7Lmv9irJVsKEC4KQ0JgEaEAA
