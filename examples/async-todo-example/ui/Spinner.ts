import { render } from '../../../core.js'
import { getState } from '../store/provider.js'

export const Spinner = () => render`
  <div
    id="spinner"
    ${getState().spinner && 'class="visible"'}
  ></div>
`
