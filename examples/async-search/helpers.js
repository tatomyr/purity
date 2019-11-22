const items = [
  { id: 1, name: 'Andrew' },
  { id: 2, name: 'John' },
]

const by = request => ({ name }) =>
  name.toLowerCase().search(request.toLowerCase()) !== -1

export const fakeEndpoint = request =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) reject(new Error('Fake error'))
      resolve(items.filter(by(request)))
    }, Math.ceil((Math.random() + Math.random() + Math.random()) * 1_000))
  })
