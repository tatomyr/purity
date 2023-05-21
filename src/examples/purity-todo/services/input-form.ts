import {setState} from "../app.js"

export const resetInput = (): void => {
	const $form = document.getElementById("task-form") as HTMLFormElement
	$form.reset()
	$form.task.blur()
	setState(() => ({input: ""}))
}
