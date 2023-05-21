import {IMAGES} from "../config/images.js"
import {makeQueryString} from "./google-api.js"
import type {Image, Task} from "../app.js"
import type {ImageSearchResponse} from "./google-api.js"

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

export const normalizeQuery = (
	queries: ImageSearchResponse["queries"],
	name: keyof ImageSearchResponse["queries"]
): Record<string, {startIndex: number}> | undefined => {
	const query = queries[name]
	return query && {[name]: {startIndex: query[0].startIndex}}
}

export const fetchAndNormalizeImages = async (
	task: Task,
	startIndex?: number
): Promise<Image> => {
	const {items: [{link = IMAGES.UNDEFINED_TASK}] = [{}], queries} =
		await fetchImages(task.description, startIndex)
	const image: Image = {
		link,
		queries: {
			...normalizeQuery(queries, "request"),
			...normalizeQuery(queries, "nextPage"),
			...normalizeQuery(queries, "previousPage"),
		},
	}
	return image
}
