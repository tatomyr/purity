import {ImageSearchResponse, makeQueryString} from './google-api.js'

const getResponseErrorMessage = (response: Response) => {
  console.warn(response)
  switch (response.status) {
    case 403:
      return 'Can not get images'
    default:
      return 'Failed to fetch images'
  }
}

export const fetchImages = (
  description: string,
  start?: number
): Promise<ImageSearchResponse> =>
  fetch(makeQueryString(description, start)).then(res => {
    if (!res.ok) {
      throw new Error(getResponseErrorMessage(res))
    }
    return res.json()
  })
