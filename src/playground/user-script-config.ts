import {debounce} from '../debounce.js'
import {sanitize} from '../sanitize.js'
import {LZString} from '../lz-string.js'
import {codeSample} from './code-sample.js'

console.log(document.location.hash)

export const defaultCode =
  LZString.decompressFromEncodedURIComponent(document.location.hash.slice(1)) ||
  codeSample

export type UpdateScript = (text: string) => void

export const updateScript = debounce((text: string) => {
  // eslint-disable-next-line prefer-const
  let userScript = document.createElement('script')
  userScript.id = 'user-script'
  userScript.type = 'module'
  userScript.text = text
  ;(document.getElementById('root') as HTMLElement).innerHTML = ''
  ;(document.getElementById('user-script') as HTMLElement).replaceWith(
    userScript
  )

  document.location.hash = LZString.compressToEncodedURIComponent(
    text // sanitize?
  )
}, 200)
