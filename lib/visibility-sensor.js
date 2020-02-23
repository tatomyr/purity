import { debounce } from './debounce.js'

const lookForParentScrollableElement = elem => {
  const parent = elem.parentNode
  if (parent === document.body) {
    return window
  }
  if (parent.scrollHeight > parent.clientHeight) {
    return parent
  }
  return lookForParentScrollableElement(parent)
}

export const trackVisibility = (elem, callback) => {
  let parent = lookForParentScrollableElement(elem)
  parent.onscroll = debounce(() => {
    callback(isInViewport(elem))
  }, -250)
  callback(isInViewport(elem))
}

/*
  Visibility sensor
  returns boolean | null (if there's no such element)

  Taken from https://vanillajstoolkit.com/helpers/isinviewport/
*/
export const isInViewport = function(elem) {
  const bounding = elem.getBoundingClientRect()
  if (
    !bounding.top &&
    !bounding.left &&
    !bounding.bottom &&
    !bounding.right &&
    !bounding.with &&
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
