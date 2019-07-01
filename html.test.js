const { html } = require('./.__html__.js')

const Parent = ({ children }) => `
  <div style="background-color: red; padding: 10px;">
    ${children || ''}
  </div>
`

const Child = ({ text, color, price }) => `
  <h2 style="background-color: ${color}; text-transform: capitalize;">
    ${text} | $${price}
  </h2>
`

describe('html', () => {
  it('should match a snapshot when Parent is empty', () => {
    const Component = () => html(Parent)`<Parent />`
    expect(Component()).toMatchSnapshot()
  })
  it('should match a snapshot when Parent containts a regular html tag', () => {
    const Component = () => html(Parent)`
      <Parent children="<h1 style='background-color: green;'>Inner text</h1>" />
    `
    expect(Component()).toMatchSnapshot()
  })
  it('should match a snapshot when Parent contains a Child component', () => {
    const Component = () => html(Parent, Child)`
      <Parent
        children="
          <Child
            price=${1.1 + 2.2}
            color='yellow'
            text='Hello!'
          />
        "
      />
    `
    expect(Component()).toMatchSnapshot()
  })
  it('should match a snapshot when Parent contains a tag and a component', () => {
    const Component = () => html(Parent, Child)`
      <Parent
        children="
          <Child
            price=${1.1 + 2.2}
            color='yellow'
            text='Hello!'
          />
          <h1 style='background-color: green;'>Inner text</h1>
        "
      />
    `
    expect(Component()).toMatchSnapshot()
  })
})
