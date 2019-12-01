# Purity (Reactive state & DOM manager)

Implementation of a reactive global store for pure JavaScript applications.

The concept is that every reactive data should be contained in one store
which is accessible through methods `connect` (for getting data) and `dispatch`
(for dispatching a synchronous or asynchronous action).

# Usage

To include **Purity** in your project import its features through CDN (make sure your root script injected in html has [type="module"]):

```javascript
import { createStore, render } from 'https://tatomyr.github.io/purity/core.js'
```

or download these files into your project's folder and import from in there.

In your application, you can declare components as bare functions. E. g.

```javascript
const Component = props => render`<div>${props.text}</div>`
```

> Please note, in order to use some handy features (like event bindings) we have to wrap a component's output into the `render` tag.

Then you can use the component inside an other one:

```javascript
const OtherComponent = () => render`
  <div>
    ...
    ${Component({ text: 'Hello World!' })}
    ...
  </div>
`
```

You can bind event handlers with double colon notation:

```javascript
const Component = () => render`
  <button
    ::click=${e => console.log(e.target)}
  >
    Click me
  </button>
`
```

You can use the `connect` method to pass all the data from the shared application state:

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
import { createStore } from '/core.js'
import { stateHandler } from './state-handler.js'
import { asyncWatcher } from './async-handler.js'

export const { mount, dispatch, connect } = createStore(
  stateHandler,
  asyncWatcher
)
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
async function someAction(action) {
  // Make API calls
  // Do asynchronous stuff
  // Dispatch other actions
}

function asyncWatcher(action) {
  switch (action.type) {
    case 'SOME_ACTION':
      return function someAction(action)
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

# Virtual dom

You can think of your application as a tree where each tag with the `id` attribute is represented by a **node**.
The most important part of the virtual DOM is **rerenderer**.
It calculates new virtual DOM and traverses through each existing **node**.
If a new corresponding **node** exists, and it shallowly differs from the previous one,
the **rerenderer** replaces `innerHTML` of the **node** and attributes of a wrapper tag.

This way the **rerenderer** could preserve text inputs cursor position, scrolling progress, etc.
At the same time, it allows a programmer to fully control the updating process.

DOM nodes get rerendered depending on how `id`s are placed across them. Basically Purity will rerender everything inside the closest common ancestor with an `id` defined on it. You can see the difference in the graph below (it's the [Mermaid](https://mermaidjs.github.io/#/) graph).

```mermaid
graph TD
  subgraph State
    state[$count: 0 -> 1 *]
  end

  subgraph Id
    root2[#root] --> span2[span#count] --> count2[$count *] == rerender the nearest # ==> span2
    root2 --> button2[button::click] == increment ==> state
  end

  subgraph NoId
    root[#root] --> span[span] --> count[$count *] == rerender the nearest # ==> root
    root --> button[button::click] == increment ==> state
  end
```

# Registering async handlers

You can use either `switch - case` notation:

```js
export function asyncWatcher(action, dispatch, state) {
  switch (action.type) {
    case types.GET_ITEMS__STARTED:
      getItems(action, dispatch, state)
      break
  }
}
```

or the `register-async` utilite:

```js
import { registerAsync } from '/register-async.js'

export const asyncWatcher = registerAsync({
  [types.GET_ITEMS__STARTED]: getItems,
})
```

# Tips

- Use uncontrolled text inputs and put them wisely, so they won't be rerendered when the input value has been changed. Form elements like checkboxes and selects could be used either in a controlled or uncontrolled way.
- Wrap every component that you want to be rerendered independently with a tag with an unique id.
- Root component must have the same id as the html element you want to mount the component to. (Depends on the algorithm we're using for mounting.)
- A **component**'s local state management considered a secondary feature. Therefore it's not a part of the library. However, it could possibly be implemented using **rerender** method which is returned from the **createStore** function (see [example](./simple-todo-example/ui/StatefulCounter.js)).
- The library doesn't sanitize your inputs. Please do it by yourself or use `/lib/sanitize.js` module.

# Credits

This library is heavily inspired by project [innerself](https://github.com/stasm/innerself).
And obviously I was thinking of [React](https://github.com/facebook/react/), [Redux](https://github.com/reduxjs/redux) & [Redux-Saga](https://github.com/redux-saga/redux-saga/).

The decision to use bare ES modules appears to be the consequence of listening to the brilliant Ryan Dahl's talk on [Deno](https://deno.land).

# Examples of usage

- [Dead simple example](./examples/dead-simple-example)
- [Simple todo](./examples/simple-todo-example)
- [Asynchronous todo](./examples/async-todo-example) (see [README](./examples/async-todo-example/README.md))
- [Colored input](./examples/colored-input-example)
- [Stateful counters](./examples/use-state-example)
- [ToDo application](https://github.com/tatomyr/reactive-todo)
- [Async search](TODO: make links accessible)

You can access them locally using `bash bin/serve.sh` and opening `http://localhost:8081/examples`.

# Development

To serve the library locally on port 8081 run `bash bin/serve.sh`.

# Testing

To run unit tests use `bash bin/jest.sh` command from the project root.

To update snapshots use `bash bin/update-jest.sh` instead.
Please notice the auxiliary `__core__.js` file created.
Do not commit it.

To show coverage report locally, run `open ./coverage/lcov-report/index.html`.

This repository contains example projects covered with end-to-end tests.
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

# Miscellaneous

The library also includes a handful of algorithms from different sources, exported as ES modules to use with **Purity** or without.
They can be found in the [lib/](./lib) folder.
