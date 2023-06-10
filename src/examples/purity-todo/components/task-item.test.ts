import {describe, it, expect, beforeEach, afterEach} from "vitest"
import {delay} from "../../../delay.js"
import {taskItem} from "./task-item.js"
import type {Task} from "../app.js"

const getTestTask = (): Task =>
	structuredClone({
		description: "test",
		id: "test",
		completed: false,
		image: {
			link: "image.png",
			queries: {
				request: {startIndex: 0},
			},
		},
		createdAt: 0,
		updatedAt: 0,
	})

describe("task-item", () => {
	afterEach(async () => {
		// Cleanup for data-purity keys.
		await delay()
	})

	it("should render correctly for a given task item", () => {
		const item = getTestTask()
		expect(taskItem(item)).toMatchInlineSnapshot(`
			"<li id="test" class="task-item "><img
						src="image.png"
						onerror="this.onerror = null; this.src = './assets/images/icon-pack/forbidden.svg'"
						loading="lazy"
					/><div 
						class="item-description" 
						data-id="test" 
						data-purity_click_0 data-purity_flag
					>test</div><button 
						id="delete-test"
						class="action-button delete-button hidden"
						data-id="test"
						title="Delete"
					>⊟</button><button
						id="toggle-test"
						class="action-button toggle-button"
						data-id="test"
						data-completed=""
						title="Toggle"
					>⊡</button></li>"
		`)
	})

	it("should render correctly for a completed task item", () => {
		const item = getTestTask()
		item.completed = true
		expect(taskItem(item)).toMatchInlineSnapshot(`
			"<li id="test" class="task-item completed"><img
						src="image.png"
						onerror="this.onerror = null; this.src = './assets/images/icon-pack/forbidden.svg'"
						loading="lazy"
					/><div 
						class="item-description" 
						data-id="test" 
						data-purity_click_0 data-purity_flag
					>test</div><button 
						id="delete-test"
						class="action-button delete-button "
						data-id="test"
						title="Delete"
					>⊟</button><button
						id="toggle-test"
						class="action-button toggle-button"
						data-id="test"
						data-completed="true"
						title="Toggle"
					>⊠</button></li>"
		`)
	})

	it("should render correctly for a given task item with subtasks", () => {
		const item = getTestTask()
		item.subtasks = [
			{description: "checked (should not be visible!)", checked: true},
			{description: "not checked (should be visible!)", checked: false},
		]
		expect(taskItem(item)).toMatchInlineSnapshot(`
			"<li id="test" class="task-item "><img
						src="image.png"
						onerror="this.onerror = null; this.src = './assets/images/icon-pack/forbidden.svg'"
						loading="lazy"
					/><div 
						class="item-description" 
						data-id="test" 
						data-purity_click_0 data-purity_flag
					>test<span class="subtask-inline">not checked (should be visible!)</span></div><button 
						id="delete-test"
						class="action-button delete-button hidden"
						data-id="test"
						title="Delete"
					>⊟</button><button
						id="toggle-test"
						class="action-button toggle-button"
						data-id="test"
						data-completed=""
						title="Toggle"
					>⊡</button></li>"
		`)
	})
})
