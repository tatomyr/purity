import {dev} from '../dev.js'

const {GOOGLE} = await import(
  dev ? '../config/google-api.local.js' : '../config/google-api.js'
)

export const makeQueryString = (query: string, start = 1): string =>
  `${GOOGLE.API_PATH}?${new URLSearchParams({
    q: `${query} -и`,
    searchType: 'image',
    imgSize: 'medium',
    num: '1',
    start: `${start}`,
    key: GOOGLE.API_KEY,
    cx: GOOGLE.CUSTOM_SEARCH_ID,
  }).toString()}`

export type ImageSearchItem = {
  kind: string
  title: string
  htmlTitle: string
  link: string
  displayLink: string
  snippet: string
  htmlSnippet: string
  mime: string
  fileFormat: string
  image: {
    contextLink: string
    height: number
    width: number
    byteSize: number
    thumbnailLink: string
    thumbnailHeight: number
    thumbnailWidth: number
  }
}

export type QueryType = {
  title: string
  totalResults: string
  searchTerms: string
  count: number
  startIndex: number
  inputEncoding: string
  outputEncoding: string
  safe: string
  cx: string
  searchType?: 'image'
  imgSize?:
    | 'huge'
    | 'icon'
    | 'large'
    | 'medium'
    | 'small'
    | 'xlarge'
    | 'xxlarge'
}

export type ImageSearchResponse = {
  items?: ImageSearchItem[]
  queries: {
    request: QueryType[]
    nextPage?: QueryType[]
    previousPage?: QueryType[]
  }
}
