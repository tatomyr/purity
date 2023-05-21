// TODO: refactor; maybe incapsulate in registerRouter?

// ----------------------- Hash Router ----------------------

type Match = Record<string, string> | undefined

let match: Match

export const getParams = (): Match => match

export const Switch = (
	routes: Record<string, (match: Match) => string>
): string | undefined => {
	for (const path in routes) {
		const params = (path.match(/:(\w+)/g) || []).map(param => param.slice(1))
		const matchRe = new RegExp(path.replace(/:\w+/g, "(\\w+[\\w\\-\\.]*)"))
		const matches = window.location.hash.match(matchRe)
		if (!matches) {
			continue
		}
		const [_, ...args] = matches
		match = params.reduce(($, param, i) => ({...$, [param]: args[i]}), {})
		return routes[path](match)
	}
	return undefined
}

export const registerRouter = (rerender: () => void): void => {
	if (window.location.href.indexOf("#/") === -1) {
		window.location.hash = "#/"
	}
	window.onhashchange = rerender
}

export const push = (hash: string): void => {
	window.location.hash = hash
}

// TODO: replace search with hash?
// export const queryParams = {
//   get: () =>
//     location.search
//       .slice(1)
//       .split('&')
//       .reduce(($, param) => {
//         const [key, value] = param.split('=')
//         return { ...$, [key]: value }
//       }, {}),
//   set: params => {
//     location.search = Object.entries(params)
//       .reduce(($, [key, value]) => `${$}${key}=${value}&`, '?')
//       .slice(0, -1)
//   },
// }
