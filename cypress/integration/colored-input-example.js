describe('Colored input example', () => {
  beforeEach(() => {
    cy.visit('/public/examples/colored-input-example/')
  })
  it('should change the color, persist the input value & the focus', () => {
    cy.get('#color')
      .should('have.attr', 'style', 'color: black;')
      .type('red')
      .should('have.value', 'red')
      .should('have.attr', 'style', 'color: red;')
      .should('have.focus')
  })
})
