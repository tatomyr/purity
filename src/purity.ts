// Types
type Allowed = string | number
type Rejected = undefined | null | false
type Simple = Allowed | Rejected
type Argument = Simple | HTMLElement[]
type Verified = Allowed | HTMLElement[]
export type Component = <P>(props?: P, ...rest: any[]) => HTMLElement // FIXME: it doesn't allow calling without an argument
type VirtualNodes = {
  node: HTMLElement
  shallow: HTMLElement
}
type DomNodesMap = Map<string, VirtualNodes> // FIXME: Element/HTMLElement - pick one
export type App<State> = {
  mount: (f: Component) => void
  rerender: () => void
  getState: () => State
  setState(callback: (state: State) => Partial<State>): void
}

const parseHTML = (html: string): HTMLElement =>
  new DOMParser().parseFromString(html, 'text/html').body

const buildNodesMap = (virtualDocument: HTMLElement): DomNodesMap => {
  const nodesMap: DomNodesMap = new Map()
  for (const node of virtualDocument.querySelectorAll('[id]')) {
    let shallow = (node as HTMLElement).cloneNode(true) as HTMLElement // FIXME: null?
    for (let innerNode of shallow.querySelectorAll('[id]')) {
      innerNode.outerHTML = `<!-- ${innerNode.tagName}#${innerNode.id} -->`
    }
    nodesMap.set(node.id, {node, shallow} as VirtualNodes)
  }
  return nodesMap
}

// Constants
const PURITY_KEYWORD = 'purity'
const DATA_PURITY_FLAG = `data-${PURITY_KEYWORD}_flag`

/**
 * App factory that should be invoked once to create a single store with reactive state
 */
export const init = <State extends Record<string, unknown>>(
  initialState: State
): App<State> => {
  let state = initialState

  let rootComponent: (...args: any[]) => DomNodesMap
  let domNodesMap: DomNodesMap
  /**
   * Mounts an App to DOM
   */
  function mount(f: Component) {
    // Setting up rootComponent
    rootComponent = (...args) => buildNodesMap(f(...args))
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
    for (const [id, domNode] of domNodesMap) {
      const newNode = newNodesMap.get(id)
      // Since we depend on the shallow comparison, we must only care about updating changed nodes.
      if (newNode && domNode.shallow.outerHTML !== newNode.shallow.outerHTML) {
        const elementById = document.getElementById(id)
        if (elementById) {
          updateAttributes(elementById, newNode)
          if (domNode.shallow.innerHTML !== newNode.shallow.innerHTML) {
            elementById.innerHTML = ''
            elementById.append(...newNode.node.childNodes)
          } else {
            console.log(`± #${id}`)
          }
        } else {
          throw new Error(`There is no element in DOM with id "${id}".`)
        }
      }
    }
    domNodesMap = newNodesMap
  }

  return {
    mount,
    rerender,
    getState: () => state,
    setState(callback) {
      Object.assign(state, callback(state))
      console.log('new state===', state)
      rerender()
    },
  }
}

// Patterns
const ARGS_RE = /__\[(\d+)\]__/gm
const BOUND_EVENTS_RE = /::(\w+)\s*=\s*__\[(\d+)\]__/gm

// Helpers
const clearFalsy = <T extends Verified>(x: T | Rejected): T | '' =>
  x === undefined || x === null || x === false ? '' : x

const bindEventHandlers = (args: Array<Argument | EventHandlerNonNull>) => (
  _: any,
  event: keyof HTMLElementEventMap,
  index: number
) => `data-${PURITY_KEYWORD}__${event}=${index} ${DATA_PURITY_FLAG}`

const processArgs = (args: Array<Argument | HTMLElement>) => (
  _: any,
  index: number
): string => {
  // FIXME:
  if (typeof args[+index] === 'object' && !Array.isArray(args[+index])) {
    console.log('!!! COMPONENT !!!', args[+index])
    return `<template data-${PURITY_KEYWORD}__component="${index}"></template>`
  }
  if (Array.isArray(args[+index])) {
    console.log('!!!! ARRAY !!!', args[+index])
    // @ts-ignore
    return (args[+index] as HTMLElement[])
      .map(
        (_, i) =>
          `<template data-${PURITY_KEYWORD}__child="${i}" data-${PURITY_KEYWORD}__array="${index}"></template>`
      )
      .join('')
    // return `<template data-${PURITY_KEYWORD}__array="${index}"></template>`
  }

  return clearFalsy(args[+index] as Argument) as string
}

/**
 * Tagged template to compute the html string from a string literal
 */

export const render = (
  [first, ...strings]: TemplateStringsArray,
  ...args: Array<Argument | EventHandlerNonNull | HTMLElement>
): HTMLElement => {
  const precomputedString: string = strings.reduce(
    ($, item, i) => `${$}__[${i}]__${item}`,
    first
  )

  const stringToRender = precomputedString
    .replace(BOUND_EVENTS_RE, bindEventHandlers(args as EventHandlerNonNull[]))
    .replace(ARGS_RE, processArgs(args as Array<Argument | HTMLElement>))
    .trim()
    .replace(/\n\s*</g, '<')
    .replace(/>\n\s*/g, '>')

  const componentElement = parseHTML(stringToRender)

  // Bind event handlers
  for (let element of componentElement.querySelectorAll(
    `[${DATA_PURITY_FLAG}]`
  )) {
    for (const key in (element as HTMLElement).dataset) {
      if (key.startsWith(PURITY_KEYWORD)) {
        const [_, event] = key.split('__') as [_: string, event?: string]
        if (event) {
          ;(element as {[key: string]: any})[`on${event}`] = args[
            // @ts-ignore
            +(element as HTMLElement).dataset[key]
          ] as EventHandlerNonNull
        }
        element.removeAttribute(`data-${key}`)
      }
    }
  }

  // Substitute nested components
  for (let childComponent of componentElement.querySelectorAll(
    `[data-${PURITY_KEYWORD}__component]`
  )) {
    const childIndex = +((childComponent as HTMLElement).dataset[
      `${PURITY_KEYWORD}__component`
    ] as string)
    console.log(
      111111,
      childComponent,
      (childComponent as HTMLElement).dataset,
      // @ts-ignore
      args[0].childNodes
    )
    childComponent.replaceWith(
      //  @ts-ignore

      ...args[childIndex].childNodes
    )
  }

  // Sustitute nested arrays of components
  for (let arrayChild of componentElement.querySelectorAll(
    `[data-${PURITY_KEYWORD}__array]`
  )) {
    const {dataset} = arrayChild as HTMLElement
    const argIndex = +(dataset[`${PURITY_KEYWORD}__array`] as string)
    const childIndex = +(dataset[`${PURITY_KEYWORD}__child`] as string)
    console.log(
      111111,
      arrayChild,
      argIndex,
      ':',
      childIndex,
      // @ts-ignore
      args[argIndex][childIndex].childNodes
    )
    arrayChild.replaceWith(
      ...((args as Argument[])[argIndex] as HTMLElement[])[childIndex]
        .childNodes
    )
  }

  return componentElement
}

// export const render = (
//   [first, ...strings]: TemplateStringsArray,
//   ...args: Array<Argument | EventHandlerNonNull | HTMLElement>
// ): ChildNode[] => {
//   const precomputedString: string = strings.reduce(
//     ($, item, i) => `${$}__[${i}]__${item}`,
//     first
//   )

//   const stringToRender = precomputedString
//     .replace(BOUND_EVENTS_RE, bindEventHandlers(args as EventHandlerNonNull[]))
//     .replace(ARGS_RE, processArgs(args as Array<Argument | HTMLElement>))
//     .trim()
//     .replace(/\n\s*</g, '<')
//     .replace(/>\n\s*/g, '>')

//   const componentElement = parseHTML(stringToRender)

//   // Bind event handlers
//   for (let element of componentElement.querySelectorAll(
//     `[${DATA_PURITY_FLAG}]`
//   )) {
//     for (const key in (element as HTMLElement).dataset) {
//       if (key.startsWith(PURITY_KEYWORD)) {
//         const [_, event] = key.split('__') as [_: string, event?: string]
//         if (event) {
//           ;(element as {[key: string]: any})[`on${event}`] = args[
//             // @ts-ignore
//             +(element as HTMLElement).dataset[key]
//           ] as EventHandlerNonNull
//         }
//         element.removeAttribute(`data-${key}`)
//       }
//     }
//   }

//   // Substitute nested components
//   for (let childComponent of componentElement.querySelectorAll(
//     `[data-${PURITY_KEYWORD}__component]`
//   )) {
//     const childIndex = +((childComponent as HTMLElement).dataset[
//       `${PURITY_KEYWORD}__component`
//     ] as string)
//     console.log(
//       111111,
//       childComponent,
//       (childComponent as HTMLElement).dataset,
//       args[0]
//     )
//     childComponent.replaceWith(
//       //  @ts-ignore

//       ...args[childIndex].childNodes
//     )
//   }

//   // Sustitute nested arrays of components
//   for (let arrayChild of componentElement.querySelectorAll(
//     `[data-${PURITY_KEYWORD}__array]`
//   )) {
//     const {dataset} = arrayChild as HTMLElement
//     const argIndex = +(dataset[`${PURITY_KEYWORD}__array`] as string)
//     const childIndex = +(dataset[`${PURITY_KEYWORD}__child`] as string)
//     console.log(111111, arrayChild, argIndex, ':', childIndex, args[argIndex])
//     arrayChild.replaceWith(
//       ...((args as Argument[])[argIndex] as HTMLElement[])[childIndex]
//         .childNodes
//     )
//   }

//   return [...componentElement.childNodes]
// }
