// Helpers
const isEmpty = obj => !obj || !Object.keys(obj).length
const filterFalsy = x => (x === undefined || x === null || x === false ? '' : x)
const joinIfArray = x => (Array.isArray(x) ? x.join('') : x)

/**
 * Store module factory that should be invoked once to create a single store with reactive state
 * @param {callback} stateHandler - a synchronous reducer
 * @param {callback} asyncWatcher - function that registers asynchronous action handlers
 * @returns an object that contains public methods to manage the store created
 */
export const createStore = (stateHandler, asyncWatcher = () => {}) => {
  const state = stateHandler(undefined, { type: 'INIT' })

  const parseHTML = html => {
    const virtualDocument = new DOMParser().parseFromString(html, 'text/html')
    const nodesMap = new Map()
    for (const node of virtualDocument.querySelectorAll('*[id]')) {
      const shallow = node.cloneNode(true)
      for (const innerNode of shallow.querySelectorAll('*[id]')) {
        innerNode.outerHTML = `<!-- ${innerNode.tagName}#${innerNode.id} -->`
      }
      // Removing the `data-purity_key`s attached in render() function
      // TODO: try to avoid the situation when we have to remove…
      // …something added in another module.
      for (const innerNode of shallow.querySelectorAll('*[data-purity_key]')) {
        innerNode.removeAttribute('data-purity_key')
      }
      nodesMap.set(node.id, { node, shallow })
    }
    return nodesMap
  }

  let rootComponent
  let domNodesMap
  function mount(f) {
    // Setting up rootComponent
    rootComponent = f
    domNodesMap = parseHTML(rootComponent())
    // Top-level component should always have an id equal to parent element's id
    const rootId = domNodesMap.keys().next().value
    document.getElementById(rootId).replaceWith(domNodesMap.get(rootId).node)
    asyncWatcher({ type: 'INIT' }, dispatch, state)
  }

  function updateAttributes(element, newNode) {
    for (const { name } of element.attributes) {
      if (name !== 'id') {
        element.removeAttribute(name)
      }
    }
    for (const { name, value } of newNode.node.attributes) {
      if (name !== 'id') {
        element.setAttribute(name, value)
      }
    }
  }

  function rerender() {
    const newNodesMap = parseHTML(rootComponent())
    for (const [id, domNode] of domNodesMap) {
      const newNode = newNodesMap.get(id)
      // Since we depend on the shallow comparison, we must only care about updating changed nodes.
      if (newNode && domNode.shallow.outerHTML !== newNode.shallow.outerHTML) {
        const elementById = document.getElementById(id)
        updateAttributes(elementById, newNode)
        if (domNode.shallow.innerHTML !== newNode.shallow.innerHTML) {
          elementById.innerHTML = newNode.node.innerHTML
          console.log(`↻ #${id}`)
        }
      }
    }
    domNodesMap = newNodesMap
  }

  function dispatch(action) {
    const changes = stateHandler(state, action)
    if (!isEmpty(changes)) {
      Object.assign(state, changes)
      rerender() // TODO: maybe use debounce to batch multiple successing rerenders?
    }
    asyncWatcher(action, dispatch, state)
  }

  return {
    mount,
    dispatch,
    connect: component => ownProps =>
      component(Object.assign({}, state, ownProps)),
    rerender,
    getState: () => state,
  }
}

// Patterns
const ARGS_RE = /__\[(\d+)\]__/gm
const BOUND_EVENTS_RE = /::(\w+)\s*=\s*__\[(\d+)\]__/gm

let purity_key = 0

/**
 * Tagged template to compute the html string from a string literal
 * @params {[string parts], ...args} - string literal
 * @returns a string that could be parsed as a valid HTML
 */
export const render = ([first, ...strings], ...args) => {
  const precomputedString = strings.reduce(
    ($, item, i) => `${$}__[${i}]__${item}`,
    first
  )

  const bindEventHandlers = (_, event, index) => {
    const key = `${purity_key}-${index}`
    setTimeout(() => {
      // Asynchronously bind event handlers after rendering everything to DOM
      let element = document.querySelector(`*[data-purity_key="${key}"]`)
      if (element) {
        element[`on${event}`] = args[index]
        element.removeAttribute('data-purity_key')
      }
    })
    return `data-purity_key="${key}"`
  }

  const processArgs = (_, index) => joinIfArray(filterFalsy(args[+index]))

  const stringToRender = precomputedString
    .replace(BOUND_EVENTS_RE, bindEventHandlers)
    .replace(ARGS_RE, processArgs)
    .trim()
    // FIXME: wouldn't it slow down too much? In the end of the day we don't really need this
    .replace(/\n\s*</g, '<')
    .replace(/>\n\s*/g, '>')

  purity_key++
  setTimeout(() => {
    // Clear purity_key after calculating each stringToRender
    purity_key = 0
  })

  return stringToRender
}
