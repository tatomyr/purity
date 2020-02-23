import { render } from '../../../core.js'
import { useState } from './useState.js'
import { createOnMount } from './onMount.js'
import { dispatch } from '../store/provider.js'

const onMount = createOnMount()

let state = { count: 0 }

export const StatefulCounter = ({ id }) => {
  let setState = useState(state)

  onMount(async () => {
    try {
      dispatch({ type: 'SHOW_SPINNER' })
      const res = await fetch('http://localhost:3000/counter')
      if (!res.ok) throw res
      const { count } = await res.json()
      setState({ count })
    } catch (err) {
      console.log({ err })
    } finally {
      dispatch({ type: 'HIDE_SPINNER' })
    }
  })

  const saveCount = async () => {
    dispatch({ type: 'SHOW_SPINNER' })
    await fetch('http://localhost:3000/counter', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count: state.count }),
    }).catch(err => alert(err.message))
    dispatch({ type: 'HIDE_SPINNER' })
  }

  return render`
    <h1 id="title">Counter</h1>
    <pre id="${id}-count">${state.count}</pre>

    <button
      id="${id}-inc-button"
      data-counter="inc"
      ::click=${() => {
        setState({ count: state.count + 1 })
      }}
    >
      Increment
    </button>
    <button
      id="${id}-dec-button"
      data-counter="dec"
      ::click=${() => {
        setState({ count: state.count - 1 })
      }}
    >
      Decrement
    </button>
    <button
      id="${id}-reset-button"
      data-counter="reset"
      ::click=${() => {
        setState({ count: 0 })
      }}
    >
      Reset
    </button>
    <button ::click=${saveCount}>Save</button>
  `
}
