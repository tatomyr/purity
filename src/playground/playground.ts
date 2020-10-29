import {debounce} from '../debounce.js'
import {init, render} from '../purity.js'
import {insertText} from '../selection-insert.js'

const {mount, getState, setState} = init({script: ''})

console.log(document.location.hash)

const defaultCode =
  decodeURIComponent(document.location.hash.slice(1)) ||
  `import {init, render} from 'https://tatomyr.gitlab.io/purity/purity.js'
// Your code
`

const updateScript: EventHandlerNonNull = debounce((e: Event) => {
  const text = (e.target as HTMLTextAreaElement).value

  let userScript = document.createElement('script')
  userScript.id = 'user-script'
  userScript.type = 'module'
  userScript.text = text
  ;(document.getElementById('root') as HTMLElement).innerHTML = ''
  ;(document.getElementById('user-script') as HTMLElement).replaceWith(
    userScript
  )

  document.location.hash = encodeURIComponent(text)
}, 200)

const PlayGround = () => render`
  <div id="editor">
    <textarea
      ::keydown=${e => {
        if ((e as KeyboardEvent).key === 'Tab') {
          e.preventDefault()
          insertText(e.target as HTMLTextAreaElement)('  ')
        }
        if ((e as KeyboardEvent).key === 'Enter') {
          console.log(e)
        }
      }}
      ::input=${updateScript}
    >${defaultCode}</textarea>
  </div>
`

mount(PlayGround)

setTimeout(() => {
  updateScript({target: document.querySelector('#editor textarea')} as Event)
  ;(document.querySelector('#editor textarea') as HTMLTextAreaElement).focus()
})

window.onerror = err => {
  ;(document.getElementById('root') as HTMLElement).innerHTML = `
    <div style="text-align: center; color: red; ">
      ${err}
    </div>
  `
}
