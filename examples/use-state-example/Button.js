import { htmx } from '/htmx.js'

export const Button = ({ parentId, action, caption, handleClick }) =>
  htmx({})`
  <button
    id="${parentId}-${action}-button"
    data-counter="${action}"
    ::click=${handleClick}
  >
    ${caption}
  </button>
`

// TODO: investigate why using `render` instead of `htmx` breaks reactivity!

// import { render } from '/core.js'

// export const Button = ({ parentId, action, caption, handleClick }) => render`
//   <button
//     id="${parentId}-${action}-button"
//     data-counter="${action}"
//     ::click=${handleClick}
//   >
//     ${caption}
//   </button>
// `
