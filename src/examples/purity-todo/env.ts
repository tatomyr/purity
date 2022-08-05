export type Env = 'prod' | 'dev' | 'ci'

export const env: Env =
  window.location.origin === 'http://localhost:8085'
    ? 'ci'
    : window.location.protocol === 'http:'
    ? 'dev'
    : 'prod'
