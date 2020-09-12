# Useful utils

A handful of algorithms from different sources for using with **Purity** or without it.

## MD5 hashing algorithm

Borrowed [here](http://www.myersdaily.org/joseph/javascript/md5-text.html).

Usage:

```javascript
import { md5 } from 'https://tatomyr.github.io/purity/utils/md5.js'

console.log(md5('some string'))
```

## Visibility Sensor

Taken [here](https://vanillajstoolkit.com/helpers/isinviewport/)

Usage:

```javascript
import { trackVisibility } from 'https://tatomyr.github.io/purity/utils/visibility-sensor.js'

…
trackVisibility($element, isInViewport => {
  console.log($element + ' is in viewport:' + isInViewport)
})
…
```

<!-- TODO: Maybe update behavior? -->

## Debounce

Usage:

```javascript
import { debounce } from 'https://tatomyr.github.io/purity/utils/debounce.js'

…
render`
  <button
    ::click=${debounce(console.log, ±<timeout>)}
  >
    Click me!
  </button>
`
…
```

Use a positive `timeout` for triggering the callback on the leading edge and a negative one for triggering the callback on the trailing edge.

## Delay

Usage:

```javascript
import { delay } from 'https://tatomyr.github.io/purity/utils/delay.js'

…
delay(<time>)
…
```

## Pipe

Usage:

```javascript
import { pipe } from 'https://tatomyr.github.io/purity/utils/pipe.js'

…
pipe(x => x ** 2, x => x / 2)(3) // 3.5
…
```

## Sanitize

Sanitizes input.
Wrap any input you use into this function
any time you put the input value into your application code
(when submitting a form, listening to typing in a `textarea` &c.).

## Register async handlers for Purity Store

An easy way of creating async watchers:

```js
import { registerAsync } from '/utils/register-async.js'

export const asyncWatcher = registerAsync({
  SOME_ACTION: async function (action, dispatch, state) {
    // Make API calls
    // Do asynchronous stuff
    // Dispatch other actions
  },
  // Other actions...
})
```

## Array Partition

...
