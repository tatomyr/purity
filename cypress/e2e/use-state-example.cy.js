describe("Simple todo example", () => {
  beforeEach(() => {
    cy.visit("/public/examples/use-state-example/")
  })
  it("should track each counter separately", () => {
    cy.get("#counter [data-counter=inc]").click().click()
    cy.get("#counter [data-counter=dec]")
      .click()
      .click()
      .click()
      .click()
      .click()
    cy.get("#counter-count").contains("-3")
    cy.get("#counter-1-count").contains("0")

    cy.get("#counter-1 [data-counter=inc]").click().click()
    cy.get("#counter-count").contains("-3")
    cy.get("#counter-1-count").contains("2")

    cy.get("#counter-1 [data-counter=reset]").click()
    cy.get("#counter-count").contains("-3")
    cy.get("#counter-1-count").contains("0")
  })
})
