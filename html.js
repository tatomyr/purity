// Helpers
const pipe = (...funcs) => x => funcs.reduce(($, f) => f($), x)
const filterFalsy = x => (x === undefined || x === null ? '' : x)
const joinIfArray = x => (Array.isArray(x) ? x.join('') : x)
const process = x =>
  pipe(
    filterFalsy,
    joinIfArray
  )(x)

const ATTR_RE = /(\w+)\s*=\s*("[^"]+"|'[^']+'|\S+)/
const COMPONENT_RE = new RegExp(
  `<([A-Z]\\w+)((\\s+?${ATTR_RE.source})*)\\s*\\/>`,
  'gm'
)
/*
  Originally component regex looks like:
  /<([A-Z]\w+)((\s+?(\w+)\s*=\s*("[^"]+"|'[^']+'|\S+))*)\s*\/>/gm,
*/
const ATTRS_RE = new RegExp(ATTR_RE, 'gm')

const trace = (condition = true) => (...args) =>
  condition ? console.log('[HTML]', ...args) : undefined

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
  trace()(Components, [first, ...strings], args)
  const computedHtml = strings.reduce(
    ($, item, i) => `${$}${process(args[i])}${item}`,
    first
  )
  const replaceComponentsWithFunctions = str =>
    str.replace(COMPONENT_RE, (_, componentName, attrs, ...rest) => {
      trace()(componentName, '-->', attrs, rest)

      const attrsArr = attrs ? attrs.match(ATTRS_RE) : []
      const attrsArrOfObj = attrsArr.map(item =>
        JSON.parse(
          `{${item.replace(ATTR_RE, (_, param, arg) => {
            trace()(_, ':=', param, arg)
            const replaced = replaceComponentsWithFunctions(arg)

            return `"${param}":${replaced
              .replace(/(?:\r\n|\r|\n)/g, '')
              .replace(/"/g, '\\"')
              .replace(/^\\"/, '"')
              .replace(/\\"$/, '"')
              .replace(/^'([^']+)'$/, (_, val) => `"${val}"`)}`
          })}}`
        )
      )

      const props = attrsArrOfObj.reduce(($, item) => ({ ...$, ...item }), {})

      const componentFunction = Components.find(
        ({ name }) => name === componentName
      )

      return componentFunction(props)
    })

  const response = replaceComponentsWithFunctions(computedHtml)
  trace(false)(response)
  return response
}

// TODO: Implement parsing nested elements (aka children)
