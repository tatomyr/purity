import {render} from '../../../index.js'
import type {Image} from '../app.js'
import {patchTask, useTasks} from '../services/tasks.js'
import {fetchAndNormalizeImages} from '../services/images.js'
import {cropSquare, getImgSrc, keepRatio} from '../services/image-processing.js'
import {selectTask} from '../services/task-details.js'
import {IMAGES} from '../config/images.js'

const TaskDetailsStyle = () => render`
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
    }

    .task-details--description textarea {
      width: 100%;
      height: 100%;
      padding: 4px 8px;
    }

  </style>
`

const createChangeImage = (direction: 'next' | 'previous') => (e: Event) => {
  const task = selectTask(useTasks.getCached().data)
  if (!task) return

  useTasks.fire({
    mutation: async ({data}) => {
      const image = await fetchAndNormalizeImages(
        task,
        task.image.queries[`${direction}Page`]?.startIndex
      )
      await patchTask({id: task.id, image})
    },
  })
}

const handleCaptureImage = ({target}: InputEvent) => {
  const [file] = (<HTMLInputElement>target).files as FileList
  const task = selectTask(useTasks.getCached().data)
  console.log({task})
  if (!task) {
    return
  }
  useTasks.fire({
    mutation: async () => {
      if (file) {
        const bigImg = await window.createImageBitmap(file)
        const smallImg = await window.createImageBitmap(bigImg, {
          ...keepRatio(bigImg)(300),
          resizeQuality: 'high',
        })
        const croppedImg = await window.createImageBitmap(
          smallImg,
          ...cropSquare(smallImg)
        )
        const link = getImgSrc(croppedImg)
        if (!link) throw new Error('Cannot read the image.')
        const image: Image = {
          link,
          queries: {
            previousPage: task?.image.queries.request,
          },
        }
        await patchTask({id: task.id, image})
      }
    },
  })
}

export const TaskDetails = (): string => {
  const {data, error, status} = useTasks.call()
  const task = selectTask(data)

  return render`
    <div class="task-details--wrapper">
      <section class="task-details--image">
        <div
          id="fullscreen-image"
          class="fullscreen-image"
          style="background-image: url('${
            status === 'pending' ? IMAGES.LOADING : task?.image.link
          }');"
        > 
          ${status === 'error' && `<pre>${error?.message} </pre>`}
          <div class="controls" id="controls">
            ${
              task?.image.queries.previousPage?.startIndex !== undefined &&
              render`
                <button ::click=${createChangeImage('previous')}>
                  Prev
                </button>
              `
            }
            ${
              task?.image.queries.nextPage?.startIndex !== undefined &&
              render`
                <button ::click=${createChangeImage('next')}>
                  Next
                </button>
              `
            }
            <label for="capture">
              Capture photo
              <input
                type="file"
                accept="image/*"
                capture="environment"
                id="capture"
                ::change=${handleCaptureImage as EventListener}
              />
            </label>
          </div>
        </div>
        
      </section>

      <section class="task-details--description">
        <!-- TODO: use debounce -->
        <textarea 
          id="task-description-edit"
          ::change=${e => {
            console.log((e.target as HTMLInputElement).value)
            // TODO: implement
          }}
        >
          ${task?.description}
        </textarea>
      </section>

      <section class="task-details--controls">
        <!-- TODO: implement -->
      </section>
    </div>
    ${TaskDetailsStyle()}
  `
}
