describe("Simple todo example", () => {
  beforeEach(() => {
    cy.visit("/public/examples/simple-todo-example/")
  })
  it("passes all the flow", () => {
    cy.get("#input-form input").type("first")
    cy.get("#input-form button[type=submit]").click()
    cy.get("ol#list").contains("li", "first")
    cy.get("#input-form input").clear().type("second")
    cy.get("ol#list").should("not.have.value", "first")
    cy.get("#input-form button[type=submit]").click()
    cy.get("#input-form button[type=reset]").click()
    cy.get("ol#list").contains("li", "first").should("not.have", "button")
    cy.get("ol#list").contains("li", "second").should("not.have", "button")

    cy.get("li#2 input[type=checkbox]").click()
    cy.get("ol#list")
      .contains("li", "second")
      .should("have.class", "checked")
      .contains("x")

    cy.get("#input-form input").type("sec")
    cy.get("ol#list").contains("li", "second")
    cy.get("ol#list").should("not.have.value", "first")

    cy.get("#input-form input").clear().type("third")
    cy.get("#input-form button[type=submit]").click()

    cy.get("#input-form button[type=reset]").click()
    cy.get("ol#list li#2 button[type=button]").click()
    cy.get("ol#list").contains("li", "first")
    cy.get("ol#list").contains("li", "third")
    cy.get("ol#list").should("not.have.value", "second")
  })
})
