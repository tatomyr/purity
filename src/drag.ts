// Source: https://stackoverflow.com/questions/8960193/how-to-make-html-element-resizable-using-pure-javascript

type InitCallback = (e: MouseEvent) => MoveCallback
type MoveCallback = (coordinates: {
  left: string
  top: string
  startLeft: string
  startTop: string
}) => StopCallback
type StopCallback = (() => void) | void
type MouseEventHandler = (e: MouseEvent) => void

export const makeDrag = (onInit: InitCallback): MouseEventHandler => {
  let startX: number, startY: number
  let startLeft: string, startTop: string
  let onMove: MoveCallback
  let onStop: StopCallback

  const initDrag: MouseEventHandler = e => {
    startX = e.clientX
    startY = e.clientY
    startLeft = (document.defaultView as Window).getComputedStyle(
      e.target as Element
    ).left
    startTop = (document.defaultView as Window).getComputedStyle(
      e.target as Element
    ).top

    document.documentElement.addEventListener('mousemove', doDrag, false)
    document.documentElement.addEventListener('mouseup', stopDrag, false)
    onMove = onInit(e)
  }

  const doDrag: MouseEventHandler = e => {
    const left = e.clientX - startX + 'px'
    const top = e.clientY - startY + 'px'
    onStop = onMove({left, top, startLeft, startTop})
  }

  const stopDrag: MouseEventHandler = e => {
    document.documentElement.removeEventListener('mousemove', doDrag, false)
    document.documentElement.removeEventListener('mouseup', stopDrag, false)
    onStop?.()
  }

  return initDrag
}
