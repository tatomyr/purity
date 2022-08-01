import {render} from '../../../index.js'
import type {Image} from '../app.js'
import {handleError} from '../services/error.js'
import {fetchAndNormalizeImages} from '../services/images.js'
import {cropSquare, getImgSrc, keepRatio} from '../services/image-processing.js'
import {selectDetailedTask} from '../services/task-details.js'
import {patchTask} from '../services/tasks.js'
import {IMAGES} from '../config/images.js'
import type {EventHandler} from '../../../purity.js'

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

const makeChangeImage =
  (direction: 'next' | 'previous'): EventHandler =>
  async () => {
    const task = selectDetailedTask()
    patchTask({...task, isImageLoading: true})
    try {
      const image = await fetchAndNormalizeImages(
        task,
        task.image.queries[`${direction}Page`]?.startIndex
      )
      await patchTask({...task, image})
    } catch (err) {
      handleError(err)
      patchTask(task)
    }
  }

const handleCaptureImage: EventHandler = async ({target}) => {
  try {
    const [file] = target.files!
    if (!file) {
      return
    }
    const task = selectDetailedTask()

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
    patchTask({...task, image})
  } catch (err) {
    handleError(err)
  }
}

export const TaskDetails = (): string => {
  const task = selectDetailedTask()

  return render`
    <div class="task-details--wrapper">
      <section class="task-details--image">
        <div
          id="fullscreen-image"
          class="fullscreen-image"
          style="background-image: url('${
            task.isImageLoading ? IMAGES.LOADING : task?.image.link
          }');"
        > 
          <div class="controls" id="controls">
            ${
              task?.image.queries.previousPage?.startIndex !== undefined &&
              render`
                <button ::click=${makeChangeImage('previous')}>
                  Prev
                </button>
              `
            }
            ${
              task?.image.queries.nextPage?.startIndex !== undefined &&
              render`
                <button ::click=${makeChangeImage('next')}>
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
                ::change=${handleCaptureImage}
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
            console.log(e.target.value)
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
