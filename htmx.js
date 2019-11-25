// TODO: remove later on

// Helpers
const pipe = (...funcs) => x => funcs.reduce(($, f) => f($), x)
const filterFalsy = x => (x === undefined || x === null || x === false ? '' : x)
const joinIfArray = x => (Array.isArray(x) ? x.join('') : x)
const process = x => pipe(filterFalsy, joinIfArray)(x)

// Patterns
const ARG_RE = /__\[(\d+)\]__/
const ARGS_RE = new RegExp(ARG_RE, 'gm')
const ATTR_RE = /(\w+)\s*=\s*__\[(\d+)\]__/
const ATTRS_RE = new RegExp(ATTR_RE, 'gm')
const COMPONENT_RE = /<([A-Z]\w*)\s+([^\/>]*)\/>/
const COMPONENTS_RE = new RegExp(COMPONENT_RE, 'gm')
const BOUND_EVENTS_RE = new RegExp(`::${ATTR_RE.source}`, 'gm')

/**
 * [Experimental]
 *
 * Higer order tagged template to parse JSX-like syntax
 * @param  {[function]} components - object that contains functions
 *    which describe Purity components used in the string literal
 * @returns tagged template that accepts a string literal
 * and @returns a string that could be parsed as a valid HTML
 *
 * HTMX stands for extended hypertext markup
 */

let purity_key = 0

// TODO: try to combine `htmx` with `render` or drop this syntax
export const htmx = components => ([first, ...strings], ...args) => {
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
    return components[componentName](props)
  }

  const bindEventHandlers = (_, event, index) => {
    const key = `${purity_key}-${index}`
    setTimeout(() => {
      let element = document.querySelector(`*[data-purity_key="${key}"]`)
      if (element) element[`on${event}`] = args[index]
    })
    return `data-purity_key="${key}"`
  }

  const response = precomputedHTMX
    .replace(COMPONENTS_RE, computeComponent)
    .replace(BOUND_EVENTS_RE, bindEventHandlers)
    .replace(ARGS_RE, (_, index) => process(args[+index]))
    .trim()
  purity_key++
  return response
}
