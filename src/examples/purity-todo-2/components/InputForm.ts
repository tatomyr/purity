import {Component, render} from '../../../index.js'
import {setState} from '../app.js'
import {createTask} from '../services/input-form.js'

const InputFormStyle: Component = () => render`
  <style id="task-form-style">
    form#task-form {
      width: 100%;
      max-width: 100%;
      height: 3rem;
      min-height: 3rem;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
    }

    form#task-form input {
      width: 100%;
      height: 100%;
      background-color: #303030;
      color: #eee;
    }

  </style>
`

export const InputForm: Component = () => render`
  <form id="task-form" ::submit=${createTask}>
    <input
      name="task"
      ::input=${(e: Event): void => {
        setState(() => ({input: (e.target as HTMLInputElement).value}))
      }}
      value=""
      placeholder="Task description"
      autocomplete="off"
    />
  </form>
  ${InputFormStyle()}
`
