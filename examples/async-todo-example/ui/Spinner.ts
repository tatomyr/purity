import {render} from '../../../src/purity.js'
import {getState} from '../app.js'

export const Spinner = () => render`
  <div
    id="spinner"
    ${getState().spinner && 'class="visible"'}
  ></div>
`
