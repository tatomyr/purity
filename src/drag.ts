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

// http://localhost:8081/public/playground/#JYWwDg9gTgLgBAb2AO2DANHKBTZATbKTEAQwGtsARKEgcwF84AzKCEOAIgDouB6FAgA8uAKwDOHAFCSAxhGRj4CEBACuyDHFrYYAZRgkY2TGJ37D2RgF44KNAAoE9AJTS5C+PoCeAG2xwbe2cAgD4sXAIoAANJODgAHkVff2A8Kw4cMWAAL2wAWiS-DhDYuLgAYlYIJVKyuDxgMTAfEi8ALmY-QQBuWrKAC2xgWn6YDoBWAAZJsB6++mk68r8mGrq4gCNoSI6ARlm4MQgfVPC8XvW4AHdUmH6OgBIEbT0DIyCuG7w7uAAfX7gAHIAMyTACkgPoFzKCz6XH6JHwfigiD6cS+dz2Mzmlw2JBkZForHUeA6YFUUGa2GhdRkFKOUA6ch8eUyOWpaLgkCyMGA8g6OBavIAbhzLqpTFACtg-DIxnBkPIxesYBAwI9nmY3tgPqqwH8AZMofM4QikYQ2v0IKKUQhOXiCUS1PgmV5ETS4LCllBhqNUbj8YTifg8szoB0idhcB64kwunknVc9h6FnF4rxCtgSjFZPJFLZUDBqHQAnBSBRi7R7PZsMErGE7XF3PnFCRYAB1W79Ut9PAQOkgXAwTlcAhMEiqHwwABqwGwVxHLwAwmxyUY8N4-PY+wOh1wAI6qQheXQy7By6D2QHLbCrQHOVyXT5dxbhGAU5BwRwrTR6kwGWAABU1RcUJ-TKZtjmwLgfAgKsAG0f0wPUAF1HzKUxXgsas6zCRxOQxe4uTbUwAEkNHsVsOy7TBdkmYIAGpiKgMiKKQujGKBWZAXQTk9TJEjsHImBKIAmBgLAWj6LgJiwEE4T7D-OAOJkrjBB4+YHzgUoFhcNw83gABBMB9UCXDwnwQgYjTBphVsNIMggapij6eJbPs9If2KAAZW8YHTWySjqNzgDsmQWjEMR0jNPBkQ4OA2jaFQJWwPsrmQKwnjsIsaAYEIAtCoKyhCuzUnSH0RhgYoACVfX83hAr6J5Nx1ZxUwSBrCskHNkoo4ywFcIA
// http://localhost:8081/public/playground/#JYWwDg9gTgLgBAb2AO2DANHKBTZATbKTEAQwGtsARKEgcwF84AzKCEOAIgDouB6FAgA8uAKwDOHAFCSAxhGRj4CEBACuyGIwC8cFGgAUASmlyF8AMowAngBtscHUYcA+LLgJQABpLhwAPIq29sB4Whw4YsAAXtgAtIF2HM4+vnAAxKwQSimpcHjAYmA2JFYAXMx2ggDcOakAFtjAtHUw5QCsAAwdYNW19NK5aXZM2bm+AEbQHuUAjD1wYhA2IW54NWNwAO4hMHXlAMwdAKTrqf21XHUk+HZQiLW+23i7s929G+MkMmS0rOp45TAqigRWwp1yMmBiyg5TkNliEWiYIecEgkRgwHk5RwxQxADdkRtVGJCPFsHYZK04Mh5ISxjAIGByh1wXB+rlLtc8LdSnUIAS7ggUZ9vr81PhYVZrqzzoMoE0WvcPl8fn98LE4dByr9sLhWb4mJVYmLNrMZSk-LwEthkt5ZPJFLpUDBqHQHHBSBRXbR9PoEDASFBaNhNIYXEq4KZHcMYABROwgXDwHR4CCQxMaLgAR1UhCs5nJ2Ep0H0AHIhtgRqXjL4o-BFIGYAB1HZ1d2p9NJrgEJgkVQ2GAANWA2E2XGDMAAwmwgTBsHhLEF9DH49gMzBDFwnrsBm4YMDkHA-THMAywJgG7AACqM+hhrSuIW5ANBkNca1cM-usCBkkASQ0fRLxgG9zzgGYOjDABqVFf2wACYH0M9MAg6C4FLHpS1qFcEy7D9tzbHQfygf9AOAltnjqFDILgGDiNIxCT1Q2j0MwlJ+jvEwHXgABBMAwHdJwHzcfBCG8Xw-HyPFdFCcIICyJJakk4BpJCMIYySAAZSsYEtKTklyZTpJkYoxDEMIrhuQgODgUpShUYl5wgTZkC0AASJBnW9ehnD0lSDNSIyZLCeVmhgJIACUFV03h9NqDzFzsIx2X8WL-MkO0HMAviwGMIA
// http://localhost:8081/public/playground/#JYWwDg9gTgLgBAb2AO2DANHKBTZATbKTEAQwGtsARKEgcwF84AzKCEOAIgDouB6FAgA8uAKwDOHAFCSAxhGRj4CEBACuyDHFrYYAZRgkY2TGJ37D2RgF44KNAAoEM1VDHQAXHADktGgCMvegBKaTkFeH0ATwAbbDgbeyD4gD4sXAIoAANJODgAHkUYuOA8Kw4cMWAAL2wAWkLYjmSc3LgAYj8SaOjEFta4AHcSmAALTwBmAAYwQQBuPtaR7GBaEZgJ6bmF3M6ZMl81fE8cPHn+3OdXDzgAEgRtPQMjRK5Ltyh6M-PISphgeWO2GihmAADdsF9+qpTFB6kDsDJ1nBkPIIds4H5oBlajQ8MBoZ4AKyTACkkLg9BaeV4DWwzWysnkilsqBg1Do8TgpAo7No9kcBigD2CKV6uVMjws-KSVlSjje1x8-j8KFogSCIRaOBgLmQcEcsSYmhgEDAJkFMAAKqbzSRYAAZbBGkWysWtQUPLi0rgmsCcsB20wASQ09kUdqtNrgAEZJkkANRwAOubAhmD2X2YWMJ7wzLwLD06L0wIpcQ3wGzJ4Oh8MOp2abNwRNV1Oh8tZuNN3OCfMLbW6-Uy1IIdES8zPRKi+Uud6eJUkALBEL9Sm5SnBUJM+AAQTAfoSQ7S+EI2VyeTxoNspXKEAgMCaC3PYKvZU63Q4cHc7hU0OweAgAzIFYdx2GyNAMMk1IXs0-R3FEsSJKu+S8NBkgMj+oa7mAIRAA
