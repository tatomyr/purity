# Purity. Declarative State & DOM Manager

![check](https://github.com/tatomyr/purity/actions/workflows/check.yaml/badge.svg)
![deploy](https://github.com/tatomyr/purity/actions/workflows/deploy.yaml/badge.svg)

<!-- TODO: rename to Prosto? -->

Declarative UI library for using the most of today's Javascript.
It doesn't require any bundlers or using npm at all, it fully leverages native ECMAScript modules system.

**Purity** exposes two main instruments to manipulate an application:

- `init` which initializes the app with a default state

- `render` tag which wraps string templates that represent app components

## Usage

### Basic Syntax

To use **Purity** in a project you have to put in your **index.html** a root element where your app will be mounted into, and script tag of `[type=module]` which points to the main js file:

```html
<html>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.js">
  </body>
</html>
```

Import **Purity** from a local file or a public URL, e. g.:

```js
import {init, render} from 'https://tatomyr.gitlab.io/purity/purity.js'
```

Next, you init the app with some default state. This will return a bunch of mehtods you can use in your app:

```js
const {mount, getState, setState} = init(defaultState)
```

Then you declare a component using the `render` tag:

```js
const App = () => render`
  <div id="root">Hello Purity!</div>
`
```

Make sure, your root element has the same `id` attribute as the root defined **index.html**.

Finally, you have to mount the App to DOM:

```js
mount(App)
```

That's it, the simplest possible Purity application is ready to be deployed!

### Nested Components

Since our components are merely bare functions that return a string, we can embed other functions called with some arguments, that return a string:

```js
const Child = ({name}) => render`
  <div>Hello ${name}!</div>
`

const Parent = () => render`
  <div>
    <h1>Welcome page</h1>
    ${Child({name: 'Guest'})}
  </div>
`
```

### Event Binding

We can add some interactivity by binding events:

```js
const Clickable = () => render`
  <button ::click=${() => console.log('Hello!')}>
    Click Me
  </button>
`
```

Please notice the double-colon syntax. The pattern is `::event-name=${<event-handler>}`.

**Purity** binds events to DOM asynchronously, so be careful when writing test.
You need delay(0) before you can simulate an event after DOM got updated.

### Virtual DOM

Bear in mind, each changeable node should have a unique id attribute defined on it.
This allows the DOM re-renderer to decouple changed nodes and update only them.
It has nothing to do with **components** which are just functions to calculate the html.

You can think of your application as of a tree where each tag with the `id` attribute is represented by a **virtual node**.
The most important part of the virtual DOM is **rerenderer**.
It calculates new virtual DOM and traverses through each existing **virtual node**.
If a new corresponding **virtual node** exists, and it shallowly differs from the previous one, the **rerenderer** replaces `innerHTML` of the **node** and attributes of a wrapper tag.

This way **rerenderer** could preserve text inputs cursor position, scrolling progress, &c.
At the same time, it allows a programmer to fully control the updating process.

DOM nodes get rerendered depending on how `id`s are placed across them.
Basically Purity will rerender everything inside the closest common ancestor with an `id` defined on it.

To get better understanding, let's consider two applications that differ only by one `id` attribute.

..........................................

You can see the difference in the graph below (it's the [Mermaid](https://mermaidjs.github.io/#/) graph):

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

### Tips

- Use uncontrolled text inputs and put them wisely, so they won't be rerendered when the input value has been changed. Form elements like checkboxes and selects could be used either in a controlled or uncontrolled way.
- Wrap every component that you want to be rerendered independently with a tag with an unique id.
- Root component must have the same id as the html element you want to mount the component to. (Depends on the algorithm we're using for mounting.)
- A **component**'s local state management considered a secondary feature. Therefore it's not a part of the library. However, it could possibly be implemented using **rerender** method which is returned from the **createStore** function (see [example](./src/examples/use-state-example/StatefulCounter.js)).
- The library doesn't sanitize your inputs. Please do it by yourself or use `/utils/sanitize.js` module.
- Due to its asynchronous nature, Purity requires special testing for applications that use it. Make sure you make delay(0) after the DOM has changed (see examples in [purity.test.ts](./src/purity.test.ts)).

<!-- TODO: Update README -->

<!-- Essentially, your components are merely a bare functions, they don't represent any entity.
What matters, is any unique component should have a unique id attribute.
You can find out more about it in **Virtual DOM** section. -->

<!-- In your application, you can declare components as bare functions. E. g.

```javascript
const Component = props => render`<div>${props.text}</div>`
```

> Please note, in order to use some handy features (like event bindings) we have to wrap a component's output into the `render` tag.

Then you can use the component inside an other one:

```javascript
const OtherComponent = () => render`
  <div>
    ...
    ${Component({text: 'Hello World!'})}
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
import {connect} from '/store-provider.js'
import {Component} from './Component.js'

export default connect(Component)
``` -->

<!-- To set up the store for your application,
you have to implement a provider via `createStore` method.

```javascript
import {createStore} from '/core.js'
import {stateHandler} from './state-handler.js'
import {asyncWatcher} from './async-handler.js'

export const {mount, dispatch, connect} = createStore(
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

Async handlers are just asynchronous funcions
and should be triggered when async watcher encounters a specific action:

```javascript
async function someAction(action, dispatch, state) {
  // Make API calls
  // Do asynchronous stuff
  // Dispatch other actions
}

function asyncWatcher(action) {
  switch (action.type) {
    case 'SOME_ACTION':
      return someAction(action, dispatch, state)
    default:
      return undefined
  }
}
```

Also you can use `register-async` utility:

```js
import {registerAsync} from '/utils/register-async.js'

export const asyncWatcher = registerAsync({
  SOME_ACTION: someAction,
})
```

Finally you have to mount your app to the DOM:

```javascript
import {mount} from '/store-provider.js'

mount(App)
``` -->

## Credits

This library is heavily inspired by project [innerself](https://github.com/stasm/innerself).
And obviously I was thinking of [React](https://github.com/facebook/react/).

The decision to use bare ES modules appears to be the consequence of listening to the brilliant Ryan Dahl's talk on [Deno](https://deno.land).

## Examples of usage

- [Dead simple example](./src/examples/dead-simple-example)
- [Simple todo](./src/examples/simple-todo-example)
- [Asynchronous todo](./src/examples/async-todo-example)
- [Colored input](./src/examples/colored-input-example)
- [Stateful counters](./src/examples/use-state-example)
- [ToDo application](https://github.com/tatomyr/reactive-todo)
- [Async search](./src/examples/async-search)
- [Multiple Applications in the same page](./src/examples/multiple-apps)

Please find the examples [here](https://tatomyr.gitlab.io/purity/examples/)

You can access them locally using `bash bin/serve.sh` and opening `http://localhost:8081/public/examples/`.

## Development

Use **node 14+**.

Install prerequisites once: `bash bin/install.sh`.

To serve the library locally on port 8081 run `bash bin/serve.sh`.

Make sure your code is compiled (run `bash bin/compile.sh` to start compilation in watch mode; if you've changed a file that isn't a typescript file, you have to re-run this command).

### Code minification

To minify files run `bash bin/minify.sh` script.

### Code linting

Use `bash bin/lint.sh` to lint the code.

### Testing

To run unit tests use `bash bin/jest.sh` command from the project root.

To show coverage report locally, run `open ./coverage/lcov-report/index.html`.

This repository contains example projects covered with end-to-end tests.
To run them continioulsy use `bash bin/cypress.sh`.
Run `bash bin/e2e.sh` to run e2e tests in headless Chrome.

### Technical debts

Use `bash bin/debts.sh` to check all `TODO`s and `FIXME`s in the project.
The result will be stored in `.debts` file.
You may commit it.

### Precommit

Before being committed to the project, code must pass all necessary checks described in `bin/check.sh`.
To add the git hook to the project, run the following command from the project root (no need if you ran the install script):

```bash
ln -s ../../bin/pre-commit.sh .git/hooks/pre-commit
```

If you've run the install script, the hook should be already in place.

You may also run `bash bin/check.sh` manually each time before commit.
On Mac you can use this command as well:

```bash
bash bin/check.sh && afplay /System/Library/Sounds/Ping.aiff || afplay /System/Library/Sounds/Sosumi.aiff
```

## Miscellaneous

The library also includes a handful of algorithms from different sources, exported as ES modules to use with **Purity** or without.
