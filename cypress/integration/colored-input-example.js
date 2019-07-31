describe('Colored input example', () => {
  beforeEach(() => {
    cy.visit('/colored-input-example/')
  })
  it('should not remove the input value', () => {
    cy.get('#color')
      .should('have.attr', 'style', 'color: black;')
      .type('red')
      .should('have.value', 'red')
      .should('have.attr', 'style', 'color: red;')
  })
})
