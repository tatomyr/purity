// Helpers
const pipe = (...funcs) => x => funcs.reduce(($, f) => f($), x)
const filterFalsy = x => (x === undefined || x === null ? '' : x)
const joinIfArray = x => (Array.isArray(x) ? x.join('') : x)
const trace = x => {
  console.log('HTMX', x)
  return x
}
const process = x =>
  pipe(
    filterFalsy,
    joinIfArray,
    trace
  )(x)

// Patterns
const ARG_RE = /__\[(\d+)\]__/
const ARGS_RE = new RegExp(ARG_RE, 'gm')
const ATTR_RE = /(\w+)\s*=\s*__\[(\d+)\]__/
const ATTRS_RE = new RegExp(ATTR_RE, 'gm')
const COMPONENT_RE = /<([A-Z]\w*)\s+([^\/>]*)\/>/
const COMPONENTS_RE = new RegExp(COMPONENT_RE, 'gm')

/**
 * [Experimental]
 *
 * Higer order tagged template to parse JSX-like syntax
 * @param  {[function]} Components - an array of functions
 *    which describe Purity components used in the string literal
 * @returns tagged template that accepts a string literal
 * and @returns a string that could be parsed as a valid HTML
 *
 * HTMX stands for extended hypertext markup
 */

export const htmx = (...Components) => ([first, ...strings], ...args) => {
  const precomputedHTMX = strings.reduce(
    ($, item, i) => `${$}__[${i}]__${item}`,
    first
  )

  const computeComponent = (_, componentName, attrs, ...rest) => {
    const attrsArr = !!attrs ? attrs.match(ATTRS_RE) : []
    const attrsArrOfObj = attrsArr.map(item => {
      const [_, param, argIndex] = item.match(ATTR_RE)
      return {
        [param]: args[argIndex],
      }
    })
    const props = attrsArrOfObj.reduce(($, item) => ({ ...$, ...item }), {})
    const Component = Components.find(({ name }) => name === componentName)
    return Component(props)
  }

  const response = precomputedHTMX
    .replace(COMPONENTS_RE, computeComponent)
    .replace(ARGS_RE, (_, index) => process(args[+index]))
    .trim()
  return response
}

// TODO: Implement parsing nested elements (aka children)
