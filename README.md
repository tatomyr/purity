# Purity (Reactive state & DOM manager)

Implementation of a reactive global store for pure JavaScript applications.

The concept is that every reactive data should be contained in one store
which is accessible through methods `connect` (for getting data) and `dispatch`
(for dispatching a synchronous or asynchronous action).

# Usage

To include **purity** in your project import its features through CDN:

```javascript
import { createStore } from 'https://tatomyr.github.io/purity/factory.js'
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

Also, you can use the `connect` method to pass all the data from the shared application state like so:

```javascript
import { connect } from '/store-provider.js'
import { Component } from './Component.js'

export default connect(Component)
```

Bear in mind, each changeable **node**
should have a unique id attribute defined on it.
This allows the DOM rerenderer to decouple changed nodes
and update only them.
It has nothing to do with **components** which are just functions to calculate the html.
Your top-level component must always have an id defined on its wrapper.
Otherwise rerender may run inconsistently.

To set up the store for your application,
you have to implement a provider via `createStore` method.

```javascript
import { createStore } from '/factory.js'
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

Async handlers are just asynchronoys funcions
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

Finally you have to mount your app to the DOM:

```javascript
import { mount } from '/store-provider.js'

mount(App)
```

Make sure your root component has the same `id` as the root defined in `index.html`,
and you have connected your script with `<script type="module" src="..."></script>`.

# HTMX

> EXPERIMENTAL FEATURE

> You can write JSX-like syntax by wrapping a string literal into `htmx(components)` tagged template.
> For example you can write:

```javascript
import { htmx } from '/modules/htmx.js'
import { Component } from './Component.js'

const OtherComponent = () => htmx({ Component })`
 <div>
   ...
   <Component text=${'Hello World!'} />
   ...
 </div>
`
```

> Each prop declaration should follow this pattern: `prop=${value}`.

> Biding event handlers is also possible with **htmx**.
> You can write simething like that:

```javascript
const Component = () => htmx({})`
  <button
    ::click=${e => console.log(e.target)}
  >
    Click me
  </button>
`
```

> Please take into account that not all possible variants could be parsed at the moment.
> E. g. so far we only support autoclosing components.

# Virtual dom

You can think of your application as a tree where each tag with the `id` attribute is represented by a **node**.
The most important part of the virtual DOM is **rerenderer**.
It calculates new virtual DOM and traverses through each existing **node**.
If a new corresponding **node** exists, and it shallowly differs from the previous one,
the **rerenderer** replaces `innerHTML` of the **node** and attributes of a wrapper tag.

This way the **rerenderer** could preserve text inputs cursor position, scrolling progress, etc.
At the same time, it allows a programmer to fully control the updating process.

# Tips

- Use uncontrolled text inputs and put them wisely, so they won't be rerendered when the input value has been changed. Form elements like checkboxes and selects could be used either in a controlled or uncontrolled way.
- Wrap every component that you want to be rerendered independently with a tag with an unique id.
- Root component must have the same id as the html element you want to mount the component to. (Depends on the algorithm we're using for mounting.)
- A **component**'s local state management considered a secondary feature. Therefore it's not a part of the library. However, it could possibly be implemented using **rerender** method which returns in the **createStore** function (see [example](./simple-todo-example/ui/StatefulCounter.js)).

# Credits

This library is heavily inspired by project [innerself](https://github.com/stasm/innerself).
And obviously I was thinking of [React](https://github.com/facebook/react/), [Redux](https://github.com/reduxjs/redux) & [Redux-Saga](https://github.com/redux-saga/redux-saga/).

The decision to use bare ES modules appears to be the consequence of listening to the brilliant Ryan Dahl's talk on [Deno](https://deno.land).

# Examples of usage

- [Dead simple example](./dead-simple-expamle/)
- [Simple todo example](./simple-todo-example/)
- [Asynchronous todo example](./async-todo-example/) (see [README](./async-todo-example/README.md))
- [Colored input example](./colored-input-expamle/)
- [ToDo application](https://github.com/tatomyr/reactive-todo)

# Development

To serve the library locally on port 8081 run `bash bin/serve.sh`.

# Testing

To run unit tests use `bash bin/jest.sh` command from the project root.

To update snapshots use `bash bin/update-jest.sh` instead.
Please notice the auxiliary `__htmx__.js` and `__factory__.js` files created.
Do not commit them.

To show coverage report locally, run `open ./coverage/lcov-report/index.html`.

This repository has example projects covered with end-to-end tests.
To run them continioulsy use `bash bin/cypress.sh`.
Run `bash bin/e2e.sh` to run e2e tests in headless Chrome.

All test could be run with `bash bin/test.sh`.

# Technical debts

Use `bash bin/debts.sh` to check all `TODO`s and `FIXME`s in the project.
The result will be stored in `.debts` file.
You may commit it.

# Precommit

To run all checks use `bash bin/check.sh` script.
On Mac you can use this command as well:

```
bash bin/check.sh && afplay /System/Library/Sounds/Ping.aiff || afplay /System/Library/Sounds/Sosumi.aiff
```
