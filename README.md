# Reactive Store (Quantum)

Implementation of reactive global store for pure JavaScript applications.

The concept is that every reactive data should be contained in one store
which is accessible through methods `connect` (for getting data) and `dispatch`
(for dispatching an syncronous or asyncronous action).

# Usage

To include **quantum** in your project import it's features through CDN: 
```javascript
import { createStore } from 'https://tatomyr.github.io/quantum/quantum.js'
import { html } from 'https://tatomyr.github.io/quantum/html.js'
```

or download these files into your project's folder and import from inthere.

In your application you can declare components as bare functions. E. g.

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

> You can write JSX-like syntax by wrapping a string literal into `html(...Components)` tagged template.
> The code above could be written like so:

```javascript
import { html } from '/modules/html.js'

const OtherComponent = () => html(Component)`
 <div>
   ...
   <Component text="Hello World!" />
   ...
 </div>
`
```

> Please take into account that not all possible variants could be parsed at the moment.
> E. g. so far we only support autoclosing components.

Also you can use `connect` method to pass all the data from the shared application state like so:

```javascript
import { connect } from '/store-provider.js'
import { Component } from './Component.js'

export default connect(Component)
```

Bare in mind, each changable component or a part of a component
should have an unique id attribute defined.
This allows the DOM updater to decouple changed elements
and replase only them.
Ideally, you'd always wrap your component in some wrapper tag with an `id` and not change its tags on the spot.
Use a `static wrapper` around your component, you may say.
Your top-level component must always have an id defined on its wrapper.
Otherwise rerender may run inconsistently.

To set up store for your application you have to implement a provider via
`createStore` method.

```javascript
import { createStore } from '/quantum.js'
import { stateHandler } from './state-handler.js'
import { asyncWatcher } from './async-handler.js'

export const { connect, dispatch, mount } = createStore(
  stateHandler,
  asyncWatcher
)
// The last step you have to mount your dispatch function somwhere
// … to be able to access it in components
// One of the options apparently is window object
window.dispatch = dispatch
```

You have to declare state handler, where should be at least one case of type 'INIT'
to return a default state.
Basically, each case should return a `state` changes.
If there's no changes, it should return an empty object.

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

- Use uncontrolled text inputs and put them wisely, so they won't be rerendered when the input value has been changed.
- Wrap every component that you want to be rerendered independently with a static wrapper (this one has to have an unique id and its attributes do not rely on state changes).
- Root component must have the same id as the html element you want to mount the component to. (Depends on the algorithm we're using for mounting.)

# Credits

This library is heavily inspired by project [innerself](https://github.com/stasm/innerself).

# Examples of usage

- [ToDo application](https://github.com/tatomyr/reactive-todo)
