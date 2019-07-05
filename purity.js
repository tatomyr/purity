/**
 * Store module factory that should be invoked once to create a single store with reactive state
 * @param {callback} stateHandler - a synchronous reducer
 * @param {callback} asyncWatcher - function that registers asynchronous action handlers
 * @returns an object that contains public methods to manage the store created
 */
export const createStore = (stateHandler, asyncWatcher = () => {}) => {
  const state = stateHandler(undefined, { type: 'INIT' })

  let rootComponent

  let domElementsMap

  const parseHTML = html => {
    const virtualDocument = new DOMParser().parseFromString(html, 'text/html')
    const elementsMap = new Map()
    for (const element of virtualDocument.querySelectorAll('*[id]')) {
      const shallow = element.cloneNode(true)
      for (const innerElement of shallow.querySelectorAll('*[id]')) {
        innerElement.outerHTML = `<!-- key="${innerElement.id}" -->`
      }
      elementsMap.set(element.id, {
        element,
        shallowHTML: shallow.outerHTML,
        wrapperHTML: shallow.cloneNode(false).outerHTML,
      })
    }
    return elementsMap
  }

  function mount(f) {
    rootComponent = f
    domElementsMap = parseHTML(rootComponent())
    // Top-level component should always have an id equal to parent element's id
    const rootId = domElementsMap.keys().next().value
    document
      .getElementById(rootId)
      .replaceWith(domElementsMap.get(rootId).element)
  }

  function rerender() {
    const newElementsMap = parseHTML(rootComponent())
    for (const [id, domEl] of domElementsMap) {
      const newEl = newElementsMap.get(id)
      if (domEl.shallowHTML !== (newEl && newEl.shallowHTML)) {
        console.log(`@${id}:`)
        const elementById = document.getElementById(id)
        if (elementById) {
          if (domEl.wrapperHTML === (newEl && newEl.wrapperHTML)) {
            console.log('└─ change')
            elementById.innerHTML = newEl.element.innerHTML
          } else {
            console.log('└─ replace')
            elementById.replaceWith(newEl.element)
          }
        } else {
          console.log('└─ ✗')
        }
      }
    }
    domElementsMap = newElementsMap
  }

  function dispatch(action) {
    const changes = stateHandler(state, action)
    Object.assign(state, changes)
    rerender()
    asyncWatcher(action, state, dispatch)
  }

  return {
    mount,
    dispatch,
    connect: component => ownProps => component(Object.assign(state, ownProps)),
    getState: () => state,
    rerender,
  }
}
