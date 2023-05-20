import {debounce, LZString, push} from '../../index.js'
import {codeSample} from './code-sample.js'

console.log(document.location.hash)

export const defaultCode =
	LZString.decompressFromEncodedURIComponent(document.location.hash.slice(1)) ||
	codeSample

export type UpdateCode = (code: string) => void

export type CreateUpdate = (updateCode: UpdateCode) => UpdateCode

export const createUpdate: CreateUpdate = updateCode =>
	debounce((text: string) => {
		updateCode(text)
		push(LZString.compressToEncodedURIComponent(text))
	}, 1000)
