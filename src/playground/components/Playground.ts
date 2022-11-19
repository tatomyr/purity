import {makeDrag, render} from '../../index.js'
import {setState} from '../playground.js'
import {Editor, getEditor} from './Editor.js'
import {PlaygroundStyle} from './PlaygroundStyle.js'
import {View} from './View.js'

const initDrag = makeDrag(e => {
  const startWidth = window.getComputedStyle(getEditor()).width
  const fullWidth = window.getComputedStyle(
    document.getElementById('playground-root')!
  ).width
  console.log('drag:init', startWidth, '/', fullWidth)
  setState(() => ({placeOverDisplay: 'initial'}))

  return ({left}) => {
    const width =
      (100 * (parseInt(startWidth, 10) + parseInt(left, 10))) /
        parseInt(fullWidth, 10) +
      '%'
    getEditor().style.width = width
    console.log('drag:move', {left})

    return () => {
      console.log('drag:stop', width)
      localStorage.playgroundEditorWidth = width
      setState(() => ({placeOverDisplay: 'none'}))
    }
  }
})

export const Playground = (): string => render`
  <div id="playground-root" class="playground">
    ${Editor()}
    <div class="resizer" >
      <div class="handler" ::mousedown=${initDrag}></div>
    </div>
    <div id="playground-view">
      <iframe id="playground-iframe" srcdoc="${View()}"></iframe>
      <div id="place-over"></div>
    </div>
    ${PlaygroundStyle()}
  </div>
`
