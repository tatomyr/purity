# Purity. Declarative State & DOM Manager

![check](https://github.com/tatomyr/purity/actions/workflows/check.yaml/badge.svg)
![deploy](https://github.com/tatomyr/purity/actions/workflows/deploy.yaml/badge.svg)

Declarative UI library for using the most of today's Javascript.
It doesn't require any bundlers or using npm at all, it fully leverages the native ECMAScript modules system.

**Purity** exposes two main instruments to manipulate an application:

- `init` which initializes the app with a default state (application-wide)

- `render` tag that wraps string templates that represent app components

## Usage

### Basic Syntax

To use **Purity** in a project you have to put in your **index.html** a root element where your app will be mounted into, and a script tag of `[type=module]` which points to the main js file:

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
import {init, render} from 'https://tatomyr.github.io/purity/purity.js'
```

Next, you init the app with some default state. This will return a bunch of methods you can use in your app:

```js
const {mount, getState, setState} = init(defaultState)
```

Then you declare a component using the `render` tag:

```js
const root = () => render`
  <div id="root">Hello Purity!</div>
`
```

Make sure that your root element has the same `id` attribute as the root defined in **index.html**.
The first will override the latest.

Finally, you have to mount the `root` to DOM:

```js
mount(root)
```

That's it, the simplest possible Purity application is ready to be deployed!

### Nested Components

Since our components are merely bare functions that return a string, we can embed other functions called with some arguments, that return a string:

```js
const child = ({name}) => render`
  <div>Hello ${name}!</div>
`

const parent = () => render`
  <div>
    <h1>Welcome page</h1>
    ${child({name: 'Guest'})}
  </div>
`
```

### Event Binding

We can add some interactivity by binding events:

```js
const clickable = () => render`
  <button ::click=${() => alert('Hello!')}>
    Click Me
  </button>
`
```

Please notice the double-colon syntax. The pattern is `::event-name=${<event-handler>}`.

**Purity** binds events to DOM asynchronously, so be careful when writing tests.
You have to use `await delay(0)` before you can simulate an event after DOM gets updated.

There is also another substantial limitation to using event handlers.
Do consider each handler an isolated function that can receive nothing from the upper scopes.
For instance, the example below is wrong since we are trying to use `WRONG_COUNT`, which has been calculated in the component's scope, inside the click handler:

```js
const wrongCounter = () => {
  const WRONG_COUNT = getState().count

  return render`
    <div id="root">
      <pre id="count">Wrong: ${WRONG_COUNT}</pre>
      <button 
        ::click=${() => setState(() => ({count: WRONG_COUNT + 1}))}
      >
        Increment
      </button>
    </div>
  `
}
```

Although the increment on click _will_ work once, it is not guaranteed to do so every time.
The event binds on the first execution, but the _button_ doesn't get updated further, so both the event handler and its _closure_ remain the same.

The correct example would look like this:

```js
const correctCounter = () => render`
  <div id="root">
    <pre id="counter">Counter: ${getState().count}</pre>
    <button ::click=${() => setState(({count}) => ({count: count + 1}))}>
      Increment
    </button>
  </div>
`
```

Please notice that `setState`'s callback receives current state as an argument.

### Virtual DOM

Bear in mind that each changeable node should have a unique `id` attribute defined on it.
This allows the DOM re-renderer to decouple changed nodes and update only them.
It has nothing to do with **components** which are just functions to calculate the HTML.

You can think of your application as a tree where each tag with the `id` attribute is represented by a **virtual node**.
The most important part of the virtual DOM is the **rerenderer**.
It calculates new virtual DOM and traverses through each existing **virtual node**.
If a new corresponding **virtual node** exists, and it shallowly differs from the previous one, the **rerenderer** replaces `innerHTML` of the **node** and attributes of a wrapper tag.

This way **rerenderer** could preserve text inputs cursor position, scrolling progress, &c.
At the same time, it allows a programmer to fully control the updating process.

DOM nodes get re-rendered depending on how `id`s are placed across them.
Basically, Purity will rerender everything inside the closest common ancestor with an `id` defined on it.

To get a better understanding, let's compare two applications that differ only by one `id` attribute.

```js
const noId = () => render`
  <div id="root">
    <span>${getState().count}</span>
    <button 
      ::click=${({count}) => setState({count: count + 1})}
    >
      Update
    </button>
  </div>
`

const withId = () => render`
  <div id="root">
    <span id="count">${getState().count}</span>
    <button 
      ::click=${({count}) => setState({count: count + 1})}
    >
      Update
    </button>
  </div>
`
```

You can see the difference in the graph below:

```mermaid
graph TD
  subgraph State
    state[$count: 0 -> 1 *]
  end

  subgraph withId
    root2[#root] --> span2[span#count] --> count2[$count *] == rerender the nearest # ==> span2
    root2 --> button2[button::click] == increment ==> state
  end

  subgraph noId
    root[#root] --> span[span] --> count[$count *] == rerender the nearest # ==> root
    root --> button[button::click] == increment ==> state
  end
```

In the _noId_ example, after updating the state inside the span all the app gets re-rendered since the closest node with `id` is _root_.
As a consequence, _button_ loses focus.
On the other hand, in the _withId_ example the only thing going to be re-rendered is text inside _span#count_.

### Async Flow

You can implement the simplest async flow using a tiny helper (you may also import it from **once.js**):

```js
const makeOnce = () => {
  const calls = new Set()
  return (id, query) => {
    if (!calls.has(id)) {
      calls.add(id)
      setTimeout(query)
    }
  }
}
```

where `id` is a unique identifier of the async operation and `query` is an asynchronous callback function which gets executed once for the `id`.
It can be used like this:

```js
const {mount, getState, setState} = init({
  spinner: false,
  stargazers_count: '-',
})

const url = `https://api.github.com/repos/tatomyr/purity`

const getStargazers = async () => {
  try {
    setState(() => ({spinner: true}))
    const {stargazers_count} = await fetch(url).then(checkResponse)
    setState(() => ({stargazers_count, spinner: false}))
  } catch (err) {
    setState(() => ({stargazers_count: '?', spinner: false}))
  }
}

const once = makeOnce()

const root = () => {
  once(url, getStargazers)

  return render`
    <div id="root">
      <pre id="stars">
        ${getState().spinner ? '⌛' : `⭐️: ${getState().stargazers_count}`}
      </pre>
      <button ::click=${getStargazers}>
        Refetch
      </button>
    </div>
  `
}

mount(root)
```

You may also check out [the imperative example](https://tatomyr.github.io/purity/playground/#JYWwDg9gTgLgBAb2AO2DANHKBTZATbKAXzgDMoIQ4ByAOloHoUCAPWgKwGdqAoHgYwjJO8BCAgBXZBjgBzbDADKMAIYxsmTguVrsJALxwUaABQIecOCJVRZKgF6FOAfUFSYALhoBaaugtWYCjIhF6kKgA2Wv6WhBRQXlIEpCjYeP5EAJR8DAxwAFSFRcUlpWXlFZVVpXyCwvAgKgDW2ADyyPzYcIYmmd0AfIgBdSJw-JFR3XAhAO5wigq9ATgwElDIcCbA6XAAjhKEAJ59+oPmlpbApJsAhOMRUbQAFiqcW3iZfecXlvePKng8O9MgBuAI-LQwAAqoGwkhgJn2R2yPyIATRJDgOTy1VxePxBMKFgEQlGQk6U0aLXanSWJPqYye2H4TQASthOJBhF1DDhOAMhpdriYbnzaBAml9wXAIgo4HEprM4ABRKDxEwAIgAElCoQAFKyqVb8wQELwauAAaiwHNo1mNKIucVofK5WimfOlzvtEn5vNtPs40pgTwoczi6OWCjWGzFXCESzR9NGawiUwABk8YDAwJwPLkVEFaLI0E8JAAjWiCEAMHCQTgMI2UQ5QBhgNZoQ7p2qk+DyJSqWwOJxTV6HDqbE5nAKQnTqEy9AVmTnBUJwGBQA6YOLQRL4bApEI7PBXUheAAMWUdG8OgouI1E1iHjigLjc0gMcBUMxUaDICn4J4TFTTJaBDXATEA5k2Q5N1sEdX5ezgE9SGuQwnzsF830kaQ4G8TYIgge5lGgFR5DtQdMKcVwcPgAB+Oi4HPBCZSIyISKgMjsAomwqNfGj3CmDDh3498YGlWcjWwBcp02BBhKwgTpE0IJkBCBIyEiaJkNPK90TGNRAJMOIpQhbQpJkpd5MokTsPcLxqDovxAlXDTwiiDR5TVXcvKgOjaBADlOC4uAGN8vTLAxHsGQoCB4B6WTvnJaTU0wfsdGfJxsmGJDrN42ylJkFc1MIbdvKgTAUNIT90osx0RggWUwJUctZWXGzFLElTXLK+Isj4SwVhjG19ygbsfgAHhPAA3Iw8H0DVYpgDV+mlSwJrAHA5oWp9OBWtaLgAEgQHcoFCmhAF4NwBqveoOAvGK9TzuoQBsYluhzAAVqQB4P+oEhjoU6ixKIY6qvO9M4Am8t+hMS1gd0zIJoYSGwYcn6DoRzbsFWn51s4RoHn6CbgH6Y7TqIBGiYm3GJix7GIYkbMhCxbGLg8Dx+AiYAWX0Y7avyrC0WZmnmfZUgAKeNHEfpmAhCF8GGBmmnuyTcR3BMJbsiAA)
(or alternatively [the declarative one](https://tatomyr.github.io/purity/playground/#JYWwDg9gTgLgBAb2AO2DANHKBTZATbKAXzgDMoIQ4ByAOloHoUCAPWgKwGdqAoHgYwjJO8BCAgBXZBiyFcBYnAC8cFGgAUASh5weDBnABUxk6bPmLlq9Zvm+g4fBABDANbYAgpwCeyfsrh1HBx8Qk1lAD5EHTgHEVjnABtEzgCEIhicGAkoZEDgPEwARwlCb3ClKIQYuFiheP4kxID1PGcYZwqqmtqE5M4AbQKAXTT6Wkb+obxhzBF2iU4ALhoweRQAc2pMQgooFakCUhRsPAze3pKyrR6L2hgAC1x1VvbOyL6U6dGVBHns5Y0TgSfj8bCcbiYNodIjaC53RowfgPF67aBdT6DEZpf6LFbUUjOYCJHLYbZwNHEOHw2q0Y7IJreIJyUJQam1c69YCkQIAQkmXxG4WqNIFNwuGR6WRyeRF8PGAqxM0wt1kpGwSIeK1eHQxctFTR1nQA3LoabVgvJCFpTarORyYhlJfojLY3e6PZ7DDoBPV4ItPD4-AEXO4vL5+MyQgptL7HLEnvxXAAlcGQYTYAI4VKVaK1bl87O0CCuYU9RIailQKABZDYADucAAotXoOoAEQACQAKt2AApwXGpQQEFbtuAAalknFoQ-ZVagtGz6c4mZU2Z6u1nHQBWfB24WnB6jwojd2jsyGpl044nCEN0lcX9UGaKgABg8YDAwMt9M4wMAtAbGgDwSAARhMlAMDgkCcAwO6UN4UAMGAORoN4b72H6qhxGkZqDiCYIQvigAK1IA8H-bDEhLEqS+KALwbgDVe5RtRrPgmz4oA2MSUY+2EUBA8AqFoHxyk+iBDlCbw7K2UCYDg6qaiQKgBuGfjqDkiSYEJubyciakvpo9xPMg6jItgSappwK7YJomj6LQ2AsGZEgwNg4p1PGeDcjyKjQs4AD8B5QBszgAF6EJwAD6ghSPAAC0gSJBAkwAMowNAzgbNggXBWFUCRdF0hwH5flwAADNSBatF54SJSlaVQBlWXzEFoXhVFkiFT5bwBc1OVtQVMB8BaV65LIrKYRcAA8nkAG6qHgSjtnxMDthEqqTWAODzYtzWcKtqq1AAJEgcQDEOwwkMdvk9R0LW5flHXwMVNB+dQRBXV5RVwG+cCTWBETqBOH2kKQsKTQw-0-fib3rShOBrTS03AHNBSLZSq2TcAUQHXAx1DsoSgqASRIkjg1BwAAZBTgSUgFIDgpwjVFSVlKaPavTg1jSMzQj8J-c5aV5DjSxLPwiTAEmSjHXJGrIuztS8zSqY6Q8sNgQLQiK79DCzbzmGSuIMVBBA-HaEAA))
and [the complex useAsync example](./src/examples/async-counter/index.js) for advanced cases.

<!-- TODO:
https://tatomyr.github.io/purity/playground/#JYWwDg9gTgLgBAb2AO2DANHKBTZATbKAXzgDMoIQ4ByAOloHoUCAPWgKwGdqAoHgYwjJO8BCAgBXZBjgBzbDADKMAIYxsmTguVqNWQrgLE4AXjgo0ACgQ84duCJVRZKgF6FOAfUFSYALhoAWmpMW3sfaQCABnQwuxxITgCAbQBdWPsHbAAbbH51PAAlbEgAqQJSFGw8DPtOMBRkQgDSFWytWKIASj4GBjgAKiHhkdGx8YnJqemxvkFheBAVAGtsAHlkfmxTOEsu0wA+RDi4eZFTtvadhCI+TJwYCShkXeAauABHCUIAT32TI42TKZYCkXYAQn4l04yTeqX2QOBSKh2XasLwqR2MCg3xOSLsfU+3ygPz2cDx+K0MAAKqBsJIYJYvr8evi4LdMrdbgIhOchFsdktVhstntev0ZpKpdKZUM5rz4GswDBgEIdtZkCoQHo8MBOCoAEa5PDdQ76fCEAAGJwAPBBlaqXgA3NrfEwAIgAJAhNdqiO64N7fdsTKG5NpVOo9rQtLl8tVipA4AAyZM0WN5ArUEje3X6o3VFNp6h5w3G7MHCl2INa7Ac+w2hj2lVCSvWnkLU4ACzyy2K9V5If0nDNiLsoIhOE4tAgywRVbguXghCgOyaAHc4ABRKAUKCWd0ACWp1IACg5IxIR4ICAEAwBqYcxy+cVn4le0KeQYRDqcLj+OI8I5mFOz5qFeC4wF2FCbiuJz1vEChPC8oFcEIYrcmc8DyEoqhQMB+iQAAcrWZqkAo-BdpYlpdjAMBgEkfQqA0tCyGgXYSAatCCCADAJBAnAMJGlA-FADDevxJF+pab52LQUG4JYlG9v235aLJcDyT2yCWNYjjOG4HjeJI0imgCWS4boun-Ecel4S47j4cZvjdF0GncWolHWWaVI6FGZLmXZTgOUZET+EE2Zue5lSaqipIBUcvmRtg3mBQg9SNM0ZBtFork9B25z8ZwACqUDZDsNF0QxfhMSxbFQZx3GUAwV4eEJagiWJRUAPycNAMAmBIYB4LoeDJmAhCeGAKjyCYACMURRO2WFwIoOSZuqNnHJk-IpUVpXZJgCVkBRVH7WVGmZFpinKfwfbYAOP6XfYHkwF5lgrltbSEIyH7apw+ryG5C7XTpRWjgumQrRm8ZFCUEA7D1tDJFEqTdbQwaQ3UEZWcd1hFZoDTIE0UABNi3yaOtsOJhArlY4hjzPFkcYFDTC7dCDCk6ThOj4Rp+X3EhTM4BaUDWmyNow-A9NwH4fiUSoyCzd61j2QoAQIC62TfAEUsJvDRBmYCMuZEluNbXpVOs-DhOZaTcDk3WwNsmyPN4Zwlh63DkDPUihsLkcMvem7VldJ+8OcOjSxgJYSotsgXQIcCjZS5WmTWphCpwAAgmAYCbRDJwPMh5pGOL+I2rqTrmHgHoUBAMDumnLvVgga0s3s3It3YNpgDgNcevpnBNyb9jBzjUZhxlxOEHA3U0IA2MTULLNCAArUgDwf9mgYICHk9gQZjleGFJC85wMuNn32DNy35-QXADCVufBoSHRaqj3Ycv8NkwB3SYKtbWbfyCBj4W2ASZcKYU4CPjmq5JObJr7dzsAAYW-ndc+DBn6v2QAgiWl8DiAD4NwAd7vb13ilMOx84AoJ-ssTgF8cCPwlgwKuCCM58HEL4SwucwA9CAA
https://tatomyr.github.io/purity/playground/#JYWwDg9gTgLgBAb2AO2DANHKBTZATbKAXzgDMoIQ4ByAOloHoUCAPWgKwGdqAoHgYwjJO8BCAgBXZBjgBzbDADKMAIYxsmTguVqNWQrgLE4AXjgo0ACgQ84duCJVRZKgF6FOAfUFSYALhoAWmpMW3tOMBRkQgDSFQAbLXQeIgBKPgYGOAAqXLz8gsKi4pLSssK+QWF4EBUAa2wAeWR+bFM4S1TTAD5EMLsqkTh+BMT2hCI+e30YCShkDuA8TABHCUIATy6TXoQ4fvtgUg6AQhH4xIBtJYBdLptpx+HRzmu8G-aYKHWDp60YAAqoGwkhgljWm3ST0m00mkwEQiGQla7VqDWarU6GSy5VxePxBNyfAR1WGAAtsPw6gAlbARRFtMw4Tg9PrTI6nZm0CB1e6-ezxBRwQhQdrRADucAAolAKFBLAAiAASAIBAAUHKpZizBAQAgq4ABqfScWiObVQp7C2W0ZmQYSMk38uwis1aiQspl0t1qD3OuAwMkUSUig4w+yDCCC2jxCCySwAViTyYTXQOOFm8xNHE4Qix8NIUn4MGAQjgYHiKg2ikk+Esc3ifIGiPgKgkeFLYuwkoAgu3S-WoI2ANxhNsdiC0CtVzqjkiVFtwBvtAAGZJgMDAnD8mRUkVosjQZIkACNaIIQAwcJBOAxaXgIPx4hsr9gH0+NoEn8AVzxMsNF2XMw1w3LcdwYPdgAPI9T3PShXxvBgtUoDYoAYMBxV-Ekhh7MAwHaTpWRsSNo1jeMAEZKKo9IwmRbBB3iTAVE4DYWg6bZdgOEjsBjONLAAZkEoTBLTA5-3+IEQBBCQwUInY4H-AFGgAEUaAJxTJDYAIkeI8GQah4DQOATzaFiWgAfn5f4dHUSw5N6awIiiGIA2+bA0ktOx-y6ewpgjREox4sjLAAFjC8KQs81ytIeR5BlERxnDcDxvFrGASDMFRxRUIzSAUfgyQY1JaEDXBLAKykaTpe0tCi5tSQ7UhjjMRKXHcKAvB8aQ4ECDpDVjc5lGgFR5FtN9H2fTxWuSjrUt8OAAB8FrgAAGOrzGOSxGuOXoVsW5aBoSIaoBGnicHfSbpvazq0tMEwzCkAhSBQN8mytadq1rPBLGoddN23TIH3FZBYxUPAzRUcBBXiYAzwvBhwH4hhOEhitsECfjTUR6h1vDaZDviY7TrGi6Nim1Qkuuubupaim2pSrqYCs7QtXo+yOgQK6GbSzBto8-Yw2eGACssEU3r+FndDsjiOa52bGYCagWGoDzBee5BRhi-luN4+MADYDcNvXUlHJ5xIUSTpNkmX-Ws1npdZRzImQaIoFiBItH5-lvP2J4deCgB2IPg4DqLwzSPz-b4gAmWO49jy0MzmBYcHwQhf2mAAeDsADdzDwEwFQoCAYAVbp+UzsAcHzwvEs4Mv-QAEj2eQlHt4qnJdwg4HMmhAGxiag4EVwAFakAeD+VbgZvW5s+iO7pmabt8EgdA6jop8l2ziu2uBdrgAAyPeaENFX17bqWt6OUgI6eTP0Jwcus4YXOH7gX94XEXxLFwsB0iAA
-->

### Tips

- Use uncontrolled text inputs and put them wisely, so they won't be re-rendered when the input value gets changed.
  Form elements like checkboxes and selects could be used either in a controlled or uncontrolled way.
- Wrap every component that you want to be rerendered independently with a tag with a unique `id`.
- Do not relay on any constants declared in a component's scope inside event handlers.
  Each event handler should be considered completely isolated from the upper scope.
  The reason is that the Virtual DOM doesn't take into account any changes in event handlers.
  Albeit you do may use a data-specific `id` on the tag to change this, it is not recommended due to performance reasons.
  See the [example](https://tatomyr.github.io/purity/playground/#JYWwDg9gTgLgBAb2AO2DANHKBTZATbKAXzgDMoIQ4ByAOloHoUCAPWgKwGdqAoHgYwjJO8BCAgBXZBjgBzbDADKMAIYxsmTguVrsJALxwUaABQIA7hWSyAXHAAMmQVBz8Yd+0QCUfQcPgAgmBgcIYmXqEAfIg8cHB+InAA6gBKAPIAcgDioXLaqurhtJZCsrHxQokAwmkpKQCiVQAqufJKBdhFzq4wfHE4MBJQyFi4BFAABuVxADx4wABuRnj6AEQUEDCrkdNxcDNgOMtrJdbbSVa2cAAkCKmZWUQzDIfYO3t7MwBGEjAwQnBdh8bDZ+AAbYD8ADW+lu4SicC07V0Jnh+miZlOV3u2TgAGo4ABGbxeIhAuDvD57ACSyH4OBAuF6VP2DB+fyElI+MwAFlA4AwuZ9XsdVt1sG5tlVoD07LcanVGk0ni8cELZuz-iNyXEQeDITC4RF0Yj8iizOK3N4ERaZRL3BUXPb8USSWSWeqaXSGUzyc9NZzds95gtKVMyTxxFIYCYgmAfEA) for more context.

- Root component must have the same `id` as the HTML element you want to mount the component to.
  (Depends on the algorithm we're using for mounting.)
- A **component**'s local state management is considered a secondary feature.
  Therefore it's not a part of the library. However, it could possibly be implemented using **rerender** method which is returned from the **init** function (see [example](./src/examples/use-state-example/StatefulCounter.js)).
- The library doesn't sanitize your inputs.
  Please do it by yourself or use the `sanitize.js` module.
- Due to its asynchronous nature, Purity requires special testing for applications that use it.
  Make sure you make delay(0) after the DOM has changed (see examples in [purity.test.ts](./src/purity.test.ts)).

## Credits

This library is heavily inspired by project [innerself](https://github.com/stasm/innerself).
And obviously, I was thinking of [React](https://github.com/facebook/react/).

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

Please find the examples [here](https://tatomyr.github.io/purity/examples/)

You can access them locally using `bash bin/serve.sh` and opening `http://localhost:8081/public/examples/`.

## Playground

Feel free to experiment in the [Playground](https://tatomyr.github.io/purity/playground/).

## Miscellaneous

The library also includes a handful of algorithms from different sources, exported as ES modules to use with **Purity** or without.

The most important ones are `router` and `async` which could help with navigation and performing asynchronous operations respectively.
