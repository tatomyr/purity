import {debounce} from './debounce.js'

const lookForParentScrollableElement = (
  elem: HTMLElement
): HTMLElement | Window => {
  const parent = elem.parentNode as HTMLElement
  if (parent === document.body) {
    return window
  }
  if (parent.scrollHeight > parent.clientHeight) {
    return parent
  }
  return lookForParentScrollableElement(parent)
}

export type VisibilityCallback = (visibilityState: boolean | null) => void

export const trackVisibility = (
  elem: HTMLElement,
  callback: VisibilityCallback
): void => {
  const parent = lookForParentScrollableElement(elem)
  parent.onscroll = debounce(() => {
    callback(isInViewport(elem))
  }, -250)
  callback(isInViewport(elem))
}

/*
  Visibility sensor
  returns boolean | null (if there's no such element)

  Source: https://vanillajstoolkit.com/helpers/isinviewport/
*/
export const isInViewport = function (elem: HTMLElement): boolean | null {
  const bounding = elem.getBoundingClientRect()
  if (
    !bounding.top &&
    !bounding.left &&
    !bounding.bottom &&
    !bounding.right &&
    !bounding.width &&
    !bounding.height
  ) {
    return null
  }
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  )
}
