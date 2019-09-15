import { connect } from '../store/provider.js'

export const Spinner = connect(
  ({ spinner }) => `
    <div
      id="spinner"
      class="${spinner ? 'visible' : ''}"
    ></div>
  `
)
