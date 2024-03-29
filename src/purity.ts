// Types
type Allowed = string | number
type Rejected = undefined | null | false
type Simple = Allowed | Rejected
type Argument = Simple | string[]
type Verified = Allowed | string[]

type VirtualNodes = {
  node: HTMLElement
  shallow: HTMLElement
}
type DomNodesMap = Map<string, VirtualNodes>

export type Rerender = () => void
export type App<State> = {
  mount: (f: () => string) => void
  rerender: Rerender
  getState: () => State
  setState(callback: (state: State) => Partial<State>): void
}

type EventName = keyof Omit<
  GlobalEventHandlersEventMap,
  | "beforeinput"
  | "compositionend"
  | "compositionstart"
  | "compositionupdate"
  | "error"
  | "focusin"
  | "focusout"
>

type Target = HTMLElement & HTMLInputElement & HTMLFormElement

type DomEvent = (Event & MouseEvent) & {
  target: Target
  currentTarget: Target
}

export type EventHandler = (e: DomEvent) => void | Promise<void>

// Constants
const PURITY_KEYWORD = "purity"
const DATA_PURITY_FLAG = `data-${PURITY_KEYWORD}_flag`

/**
 * App factory that should be invoked once to create an application state
 */
export const init = <State extends Record<string, unknown>>(
  initialState: State
): App<State> => {
  const state = initialState

  /**
   * Parses an html string and returns so called 'nodeMap' which represents the virtual DOM
   */
  const buildNodesMap = (html: string): DomNodesMap => {
    const virtualDocument = new DOMParser().parseFromString(html, "text/html")
    const nodesMap: DomNodesMap = new Map()
    for (const node of virtualDocument.querySelectorAll<HTMLElement>("[id]")) {
      const shallow = node.cloneNode(true) as HTMLElement
      for (const innerNode of shallow.querySelectorAll("[id]")) {
        innerNode.outerHTML = `<!-- ${innerNode.tagName}#${innerNode.id} -->`
      }
      // Removing the `data-purity_*` attributes attached in render() function
      // TODO: try to avoid the situation when we have to remove something added in another module.
      for (const innerNode of shallow.querySelectorAll<HTMLElement>(
        `[${DATA_PURITY_FLAG}]`
      )) {
        for (const key in innerNode.dataset) {
          if (key.startsWith(PURITY_KEYWORD)) {
            innerNode.removeAttribute(`data-${key}`)
          }
        }
      }
      nodesMap.set(node.id, {node, shallow})
    }
    return nodesMap
  }

  let rootComponent: () => DomNodesMap
  let domNodesMap: DomNodesMap
  /**
   * Mounts an App to DOM
   */
  function mount(f: () => string) {
    // Setting up rootComponent
    rootComponent = () => buildNodesMap(f())
    domNodesMap = rootComponent()
    // Top-level component should always have an id equal to a root element's id
    const rootId: string = domNodesMap.keys().next().value
    const root = document.getElementById(rootId)
    const rootNode = domNodesMap.get(rootId)?.node
    if (root && rootNode) {
      root.replaceWith(rootNode)
    } else {
      throw new Error(
        `Root DOM element's id does not correspond to the defined application root id "${rootId}".`
      )
    }
  }

  /**
   * Updates element's attributes from current state to one specified in newNode
   */
  function updateAttributes(element: HTMLElement, newNode: VirtualNodes) {
    for (const {name} of element.attributes) {
      element.removeAttribute(name)
    }
    for (const {name, value} of newNode.node.attributes) {
      element.setAttribute(name, value)
    }
  }

  /**
   * Forces html re-rendering with the current state
   */
  function rerender() {
    const newNodesMap = rootComponent()
    console.warn("🌀")
    for (const [id, domNode] of domNodesMap) {
      const newNode = newNodesMap.get(id)
      // Since we depend on the shallow comparison, we must only care about updating changed nodes.
      if (newNode && domNode.shallow.outerHTML !== newNode.shallow.outerHTML) {
        const elementById = document.getElementById(id)
        if (elementById) {
          updateAttributes(elementById, newNode)
          if (domNode.shallow.innerHTML !== newNode.shallow.innerHTML) {
            elementById.innerHTML = newNode.node.innerHTML
            console.warn(`\t↻ #${id}`)
          } else {
            console.warn(`\t± #${id}`)
          }
        } else {
          throw new Error(`There is no element in the DOM with id "${id}".`)
        }
      }
    }
    domNodesMap = newNodesMap
  }

  return {
    mount,
    rerender,
    getState: () => state,
    setState(callback: (state: State) => Partial<State>) {
      Object.assign(state, callback(state))
      rerender()
    },
  }
}

// Patterns
const ARGS_RE = /__\[(\d+)\]__/gm
const BOUND_EVENTS_RE = /::(\w+)\s*=\s*__\[(\d+)\]__/gm

// Helpers
export const isTruthy = <T>(x: T | Rejected): x is T =>
  x !== undefined && x !== null && x !== false

const clearFalsy = <T extends Verified>(x: T | Rejected): T | "" =>
  isTruthy(x) ? x : ""

const joinIfArray = (x: Verified): Allowed =>
  Array.isArray(x) ? x.join("") : x

/**
 * Increments the Purity Key and resets it after all sync operations completed
 */
const applyPurityKey = (() => {
  let purityKey = 0
  let timeout: number | undefined
  return () => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      purityKey = 0
    })
    return purityKey++
  }
})()

/**
 * Tagged template to compute the html string from a string literal
 */
export const render = (
  [first, ...strings]: TemplateStringsArray,
  ...args: Array<Argument | EventHandler>
): string => {
  const precomputedString: string = strings.reduce(
    ($, item, i) => `${$}__[${i}]__${item}`,
    first
  )

  const bindEventHandlers = (_: unknown, event: EventName, index: number) => {
    const dataName = `data-${PURITY_KEYWORD}_${event}_${applyPurityKey()}`
    setTimeout(() => {
      // Asynchronously bind event handlers after rendering everything to DOM
      const element = document.querySelector<HTMLElement>(`[${dataName}]`)
      const prop = args[index]
      if (element && typeof prop === "function") {
        element[`on${event}`] = prop as EventListener
        // Remove residuals (needed for consistency)
        element.removeAttribute(dataName)
      }
    })
    return `${dataName} ${DATA_PURITY_FLAG}`
  }

  const processArgs = (_: unknown, index: number): string =>
    joinIfArray(clearFalsy(args[+index] as Argument)) as string

  const stringToRender = precomputedString
    .replace(BOUND_EVENTS_RE, bindEventHandlers)
    .replace(ARGS_RE, processArgs)
    .trim()
    .replace(/\n\s*</g, "<")
    .replace(/>\n\s*/g, ">")

  return stringToRender
}
