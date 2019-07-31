// Helpers
const isEmpty = obj => !obj || !Object.keys(obj).length

/**
 * Store module factory that should be invoked once to create a single store with reactive state
 * @param {callback} stateHandler - a synchronous reducer
 * @param {callback} asyncWatcher - function that registers asynchronous action handlers
 * @returns an object that contains public methods to manage the store created
 */
export const createStore = (stateHandler, asyncWatcher = () => {}) => {
  const state = stateHandler(undefined, { type: 'INIT' })

  let rootComponent

  let domNodesMap

  const parseHTML = html => {
    const virtualDocument = new DOMParser().parseFromString(html, 'text/html')
    const nodesMap = new Map()
    for (const node of virtualDocument.querySelectorAll('*[id]')) {
      const shallow = node.cloneNode(true)
      for (const innerNode of shallow.querySelectorAll('*[id]')) {
        innerNode.outerHTML = `<!-- ${innerNode.tagName}#${innerNode.id} -->`
      }
      nodesMap.set(node.id, {
        node,
        shallow,
      })
    }
    return nodesMap
  }

  function mount(f) {
    rootComponent = f
    domNodesMap = parseHTML(rootComponent())
    // Top-level component should always have an id equal to parent element's id
    const rootId = domNodesMap.keys().next().value
    document.getElementById(rootId).replaceWith(domNodesMap.get(rootId).node)
    asyncWatcher({ type: 'INIT' }, state, dispatch)
  }

  function updateAttributes(element, newNode) {
    for (let attr of element.attributes) {
      if (attr.name !== 'id') {
        element.removeAttribute(attr)
      }
    }
    for (let { name, value } of newNode.node.attributes) {
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
      rerender()
    }
    asyncWatcher(action, state, dispatch)
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
