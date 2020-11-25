export const codeSample = `import {init, render} from 'https://tatomyr.gitlab.io/purity/purity.js'

const {mount, getState, setState} = init({greeting: 'Hello World!'})

const App = () => render\`
  <div id="root">
    \${getState().greeting}
  </div>
\`

mount(App)
`

// TODO: use it later
const PLAYGROUND_EXAMPLES = [
  "http://localhost:8081/public/playground/#import%20%7Binit%2C%20render%7D%20from%20'https%3A%2F%2Ftatomyr.gitlab.io%2Fpurity%2Fpurity.js'%0A%0Aconst%20%7Bmount%2C%20getState%2C%20setState%7D%20%3D%20init(%7B%7D)%0A%0Aconst%20App%20%3D%20()%20%3D%26gt%3B%20render%60%0A%20%20%26lt%3Bdiv%20id%3D%26quot%3Broot%26quot%3B%26gt%3B%0A%20%20%20%20Type%20a%20color%3A%20%0A%20%20%20%20%26lt%3Binput%20%0A%20%20%20%20%20%20id%3D%26quot%3Bcolor%26quot%3B%0A%20%20%20%20%20%20style%3D%26quot%3Bcolor%3A%20%24%7BgetState().value%7D%26quot%3B%0A%20%20%20%20%20%20%3A%3Ainput%3D%24%7B(%7Btarget%3A%20%7Bvalue%7D%7D)%20%3D%26gt%3B%20setState(()%20%3D%26gt%3B%20(%7Bvalue%7D))%7D%0A%20%20%20%20%2F%26gt%3B%0A%20%20%26lt%3B%2Fdiv%26gt%3B%0A%60%0A%0Amount(App)",
  "http://localhost:8081/public/playground/#import%20%7Binit%2C%20render%7D%20from%20'..%2Fpurity.js'%0A%0Aconst%20defaultState%20%3D%20%7Bvalue%3A%202%7D%0A%0Aexport%20let%20state%20%3D%20%7B...defaultState%7D%0A%0Aconst%20%7Bmount%2C%20setState%7D%20%3D%20init(state)%0A%0Aconst%20App%20%3D%20()%20%3D%26gt%3B%20render%60%0A%20%20%26lt%3Bdiv%20id%3D%26quot%3Broot%26quot%3B%26gt%3B%0A%20%20%20%20%26lt%3Binput%20%0A%20%20%20%20%20%20type%3D%26quot%3Bnumber%26quot%3B%20%0A%20%20%20%20%20%20value%3D%26quot%3B%24%7BdefaultState.value%7D%26quot%3B%20%0A%20%20%20%20%20%20%3A%3Ainput%3D%24%7B(%7Btarget%3A%20%7Bvalue%7D%7D)%20%3D%26gt%3B%20setState(()%20%3D%26gt%3B%20(%7Bvalue%7D))%7D%0A%20%20%20%20%2F%26gt%3B%0A%20%20%20%20%26lt%3Bspan%20id%3D%26quot%3Bsquared%26quot%3B%26gt%3B%0A%20%20%20%20%20%20squared%3A%20%24%7Bstate.value%20**%202%7D%0A%20%20%20%20%26lt%3B%2Fspan%26gt%3B%0A%20%20%26lt%3B%2Fdiv%26gt%3B%0A%60%0A%0Amount(App)",
  'http://localhost:8081/public/playground/#JYWwDg9gTgLgBAb2AO2DANHKBTZATbKAXzgDMoIQ4ByAOloHowBXKNAT1oCsBnagKH4BjCMh7wCpAIbMANjADKMKTGxwAvIgBuU2c2wAuOACYig7AA9IsOLOzxxKtZoT1akmfKVOzw0eMQQCGZkDDgee29VEk0UNAAKR1UASkERMXgAQTAwDTh45I0AMgBzGABuLFwCKAADfjg4IvlyvGAtOGA8dSKAR2YICopBvoGK0oqGxqaWlBYYKem4GHYwbB7+wfLkZhAAI0JRrbhF6Z09daOKgBIEDzlFZVVac-0iK8rTxoMDOeYYdS3eIIZRQEr2IwIV7YIhEQo9MqVCKPJzxArFRH5KG6N7JZJmJYMCblU7NCo8MBSZCdbofHj9KQ4PAfYlfcIMplGW5JbAvHFqABUApMBOmZPKDApVNZjXFDDaWlZ9X4QRCMHi2TAySAA',
]
