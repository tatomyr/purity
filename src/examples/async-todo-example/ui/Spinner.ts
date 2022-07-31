import {render} from '../../../purity.js'
import {getState} from '../app.js'

export const Spinner = (): string => render`
  <div
    id="spinner"
    class=${getState().spinner && 'visible'}
  ></div>
`
