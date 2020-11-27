// Source: https://stackoverflow.com/questions/8960193/how-to-make-html-element-resizable-using-pure-javascript
type DragCallback = (width: string) => void

type InitDrag = (e: MouseEvent) => void

export const useDrag = (id: string, callback?: DragCallback): InitDrag => {
  let startX: number, startWidth: number

  function initDrag(e: MouseEvent) {
    const resizable = document.getElementById(id)
    if (!resizable) {
      console.error(`There is no element with id ${id}`)
      return
    }
    startX = e.clientX
    startWidth = parseInt(
      (document.defaultView as Window).getComputedStyle(resizable).width,
      10
    )
    document.documentElement.addEventListener('mousemove', doDrag, false)
    document.documentElement.addEventListener('mouseup', stopDrag, false)
  }

  function doDrag(e: MouseEvent) {
    // eslint-disable-next-line prefer-const
    let resizable = document.getElementById(id)
    if (!resizable) {
      console.error(`There is no element with id ${id}`)
      stopDrag()
      return
    }
    const width = startWidth + e.clientX - startX + 'px'
    resizable.style.width = width
    callback?.(width)
  }

  function stopDrag() {
    document.documentElement.removeEventListener('mousemove', doDrag, false)
    document.documentElement.removeEventListener('mouseup', stopDrag, false)
  }

  return initDrag
}
