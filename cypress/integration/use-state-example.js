describe('Simple todo example', () => {
  beforeEach(() => {
    cy.visit('/examples/use-state-example/')
  })
  it('should track each counter separately', () => {
    cy.get('#counter-inc-button')
      .click()
      .click()
    cy.get('#counter-dec-button')
      .click()
      .click()
      .click()
      .click()
      .click()
    cy.get('#counter-count').contains('-3')
    cy.get('#counter-1-count').contains('0')

    cy.get('#counter-1-inc-button')
      .click()
      .click()
    cy.get('#counter-count').contains('-3')
    cy.get('#counter-1-count').contains('2')

    cy.get('#counter-1-reset-button').click()
    cy.get('#counter-count').contains('-3')
    cy.get('#counter-1-count').contains('0')
  })
})
