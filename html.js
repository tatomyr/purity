// Helpers
const pipe = (...funcs) => x => funcs.reduce(($, f) => f($), x)
const filterFalsy = x => (x === undefined || x === null ? '' : x)
const joinIfArray = x => (Array.isArray(x) ? x.join('') : x)
const process = x =>
  pipe(
    filterFalsy,
    joinIfArray
  )(x)

/**
 * [Experimental]
 *
 * Higer order tagged template to parse JSX-like syntax
 * @param  {[function]} Components - an array of functions
 *    which describe Quantum components used in the string literal
 * @returns tagged template that accepts a string literal
 * and @returns a string that could be parsed as a valid HTML
 */

export const html = (...Components) => ([first, ...strings], ...args) => {
  console.log('[HTML]', Components, [first, ...strings], args)
  const computedHtml = strings.reduce(
    ($, item, i) => `${$}${process(args[i])}${item}`,
    first
  )
  console.log('[HTML]', computedHtml)
  const response = computedHtml.replace(
    /<([A-Z]\w+)\s(.*?)\/>/gm,
    (_, componentName, attrs) => {
      const propsStr = `{${attrs
        .replace(/=/gm, ':')
        .replace(/(\w+?)\s*:/gm, (_, param) => `,"${param}":`)
        .replace(/^\s*?,/, '')}}`
      const props = JSON.parse(propsStr)
      const componentFunction = Components.find(
        ({ name }) => name === componentName
      )
      console.log(
        '[HTML]',
        `<${componentName}`,
        attrs,
        '/> -->',
        `(${componentFunction})(${propsStr})`
      )
      return componentFunction(props)
    }
  )
  console.log('[HTML]', response)
  return response
}

// TODO: Implement parsing nested elements (aka children)
