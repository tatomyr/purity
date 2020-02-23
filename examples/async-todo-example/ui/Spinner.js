import { render } from '../../../core.js'
import { connect } from '../store/provider.js'

export const Spinner = connect(
  ({ spinner }) => render`
    <div
      id="spinner"
      ${spinner && 'class="visible"'}
    ></div>
  `
)
