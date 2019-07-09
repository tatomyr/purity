# Purity (Reactive state & DOM manager)

Implementation of a reactive global store for pure JavaScript applications.

The concept is that every reactive data should be contained in one store
which is accessible through methods `connect` (for getting data) and `dispatch`
(for dispatching a synchronous or asynchronous action).

# Usage

To include **purity** in your project import its features through CDN:

```javascript
import { createStore } from 'https://tatomyr.github.io/purity/purity.js'
import { htmx } from 'https://tatomyr.github.io/purity/htmx.js'
```

or download these files into your project's folder and import from in there.

In your application, you can declare components as bare functions. E. g.

```javascript
const Component = props => `<div>${props.text}</div>`
```

Then you can use the component inside an other one:

```javascript
const OtherComponent = () => `
  <div>
    ...
    ${Component({ text: 'Hello World!' })}
    ...
  </div>
`
```

> EXPERIMENTAL FEATURE

> You can write JSX-like syntax by wrapping a string literal into `htmx(...Components)` tagged template.
> The code above could be written like so:

```javascript
import { htmx } from '/modules/htmx.js'

const OtherComponent = () => htmx(Component)`
 <div>
   ...
   <Component text=${'Hello World!'} />
   ...
 </div>
`
```

> Each prop declaration should follow this pattern: `prop=${value}`.

> Please take into account that not all possible variants could be parsed at the moment.
> E. g. so far we only support autoclosing components.

Also, you can use the `connect` method to pass all the data from the shared application state like so:

```javascript
import { connect } from '/store-provider.js'
import { Component } from './Component.js'

export default connect(Component)
```

Bear in mind, each changeable component or a part of a component
should have a unique id attribute defined on it.
This allows the DOM updater to decouple changed elements
and replace only them.
Ideally, you'd always wrap your component in some wrapper tag with an `id`
and not change its attributes on the spot.
Use a **static wrapper** around your component, you may say.
Your top-level component must always have an id defined on its wrapper.
Otherwise rerender may run inconsistently.

To set up the store for your application,
you have to implement a provider via `createStore` method.

```javascript
import { createStore } from '/purity.js'
import { stateHandler } from './state-handler.js'
import { asyncWatcher } from './async-handler.js'

export const { connect, dispatch, mount } = createStore(
  stateHandler,
  asyncWatcher
)
// The last step you have to mount your dispatch function somewhere
// … to be able to access it in components
// One of the options apparently is the 'window' object
window.dispatch = dispatch
```

You have to declare state handler, where should be at least one case of type 'INIT'
to return a default state.
Basically, each case should return `state` changes.
If there are no changes, it should return an empty object.

```javascript
const stateHandler = (state = defaultState, action = {}) => {
  switch (action.type) {
    // Handle your cases
    case 'INIT':
      return state
    default:
      return {}
  }
}
```

Async handlers a just an asynchronoys funcions
and should be triggered when async watcher encounters a specific action:

```javascript
async function someAction(action, state, dispatch) {
  // Make API calls
  // Do asynchronous stuff
  // Dispatch other actions
}

function asyncWatcher(action, state, dispatch) {
  switch (action.type) {
    case 'SOME_ACTION':
      return function someAction(action, state, dispatch)
    default:
      return undefined
  }
}
```

# Tips

- Use uncontrolled text inputs and put them wisely, so they won't be rerendered when the input value has been changed. Form elements like checkboxes and selects could be used either in a controlled or uncontrolled way.
- Wrap every component that you want to be rerendered independently with a static wrapper (this one has to have a unique id and its attributes do not rely on state changes).
- Root component must have the same id as the html element you want to mount the component to. (Depends on the algorithm we're using for mounting.)

# Credits

This library is heavily inspired by project [innerself](https://github.com/stasm/innerself).

# Examples of usage

- [ToDo application](https://github.com/tatomyr/reactive-todo)

# Development

To serve the library locally on port 8081 run `bash bin/serve.sh`.

# Testing

To run tests use `bash bin/test.sh` command from the project root.
You can use on Mac this command as well:

```
bash bin/test.sh && afplay /System/Library/Sounds/Ping.aiff || afplay /System/Library/Sounds/Sosumi.aiff
```

To update snapshots use `bash bin/test-update.sh` instead.
Please notice the auxiliary `__htmx__.js` and `__purity__.js` files created.
Do not commit them.

To show [coverage report](https://tatomyr.github.io/purity/coverage/lcov-report/index.html) locally, run `open ./coverage/lcov-report/index.html`.
