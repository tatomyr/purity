import {render} from "../../../index.js"
import {SMALL_BUTTON} from "./subtask-item.js"

export const taskDetailsStyle = (): string => render`
	<style id="task-details-style">
		#task-details .modal-content {
			height: calc(90vh - 3rem);
		}

		.task-details--wrapper {
			display: flex;
			flex-direction: column;
			height: 100%;
		}

		.task-details--image .fullscreen-image {
			height: 90vw;
			max-height: 90vw;
			transition: height .2s ease-in;
			
			background-size: cover;
			background-position: center;
			position: relative;
		}

		.task-details--image .controls {
			position: absolute;
			bottom: 0;
			padding: 8px;
			display: flex;
			justify-content: space-evenly;
			width: 100%;
		}

		.task-details--image .controls button,
		.task-details--image .controls label {
			padding: 4px 16px;
			background: #555;
			color: white;
			opacity: 0.75;
			border-radius: 8px;
		}

		.task-details--description {
			flex-grow: 1;
			background: pink;
		}

		.task-details--description textarea {
			width: 100%;
			height: 3rem;
			padding: 4px 8px;
		}

		.description-edit, .subtask-input {
			width: 100%;
			padding: 4px 8px;
		}

		.subtask {
			display: flex;
			align-items: center;
			padding: 0 8px;
			gap: 8px;
		}

		.${SMALL_BUTTON} {
			width: 2rem;
			min-width: 2rem;
			height: 2rem;
			font-size: 1.5rem;
		}

	</style>
`
