import {ImageSearchResponse, makeQueryString} from './google-api.js'

export const fetchImages = (
  description: string,
  start?: number
): Promise<ImageSearchResponse> =>
  fetch(makeQueryString(description, start))
    .then(res => {
      return res.json()
    })
    .then(obj => {
      if (obj.error) {
        throw new Error(obj.error.message)
      } else {
        return obj
      }
    })
