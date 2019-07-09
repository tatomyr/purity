const { htmx } = require('./__htmx__.js')

const Parent = ({ children }) => htmx()`
  <div style="background-color: red; padding: 10px;">
    ${children}
  </div>
`

const Child = ({ text, color, price }) => htmx()`
  <h2 style="background-color: ${color};">
    ${text} | $${price}
  </h2>
`

describe('htmx', () => {
  it('should match a snapshot when Parent is empty', () => {
    const Component = () => htmx(Parent)`<Parent />`
    expect(Component()).toMatchSnapshot()
  })
  it('should match a snapshot when Parent containts a regular htmx tag', () => {
    const Component = () => htmx(Parent)`
      <Parent children=${`<h1 style="background-color: green;">Inner text</h1>`} />
    `
    expect(Component()).toMatchSnapshot()
  })
  it('should match a snapshot when Parent contains a Child component', () => {
    const Component = () => htmx(Parent)`
      <Parent
        children=${htmx(Child)`
          <Child price=${1.1 + 2.2} color=${'yellow'} text=${'Some good'} />
        `}
      />
    `
    expect(Component()).toMatchSnapshot()
  })
  it('should match a snapshot when Parent contains a tag and a component', () => {
    const Component = () => htmx(Parent)`
      <Parent
        children=${htmx(Child)`
          <h1 style='background-color: green;'>Inner text</h1>
          <Child
            price=${1.1 + 2.2}
            color=${'yellow'}
            text=${'Some good'}
          />
        `}
      />
    `
    expect(Component()).toMatchSnapshot()
  })
  it('should match a snapshot when rendering arrays', () => {
    const items = ['Az', 'Bukh', 'Vedh']
    const Item = ({ name, id }) => htmx()`
      <li id="list-${id}">${name}</li>
    `
    const Component = () => htmx()`
      <ul>
        ${items.map((name, i) => htmx(Item)`<Item name=${name} id=${i} />`)}
      </ul>
    `
    expect(Component()).toMatchSnapshot()
  })
  it('should match a snapshot when an array is provided as a prop', () => {
    const letters = [
      { id: 1, title: 'Az' },
      { id: 2, title: 'Bukh' },
      { id: 3, title: 'Vedh' },
    ]
    const Item = ({ id, title }) => `<li id="item-${id}">${title}</li>`
    const Letters = ({ items }) => htmx()`
      <ol style="border: 1px solid green;">
        ${items.map(Item)}
      </ol>
    `
    const Component = () => htmx(Parent)`
      <Parent children=${htmx(Letters)`<Letters items=${letters} />`} />
    `
    expect(Component()).toMatchSnapshot()
  })
})

// TODO: test if it works with CONNECTED InnerComponents
