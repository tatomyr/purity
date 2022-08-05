import {render} from '../../../index.js'
import {useAsync} from '../app.js'
import type {JSONValue} from '../services/storage.js'
import {ACTION_BUTTON} from './AppStyle.js'

const extractVersion = (name?: string): string => {
  const [version] = name?.match(/\d+.\d+/) || ['No version specified']
  return version
}

export const Version = (): string => {
  const {data} = useAsync<JSONValue & {name: string}>('./manifest.json', () =>
    fetch('./manifest.json').then(res => res.json())
  ).call()

  return render`
    <p>Version</p>
    <div id="version" class="${ACTION_BUTTON}">
      ${extractVersion(data?.name)}
    </div>
  `
}
