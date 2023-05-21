describe("Multiple event handlers", () => {
	beforeEach(() => {
		cy.visit("/public/examples/multiple-event-handlers/index.html")
	})
	it("handle both type & click events", () => {
		cy.get("input").type("test")
		cy.get("#text").should("have.text", "test")
		cy.get("input").click()
		cy.get("#text").should("have.text", "")
		cy.get("input").type(" more text")
		cy.get("#text").should("have.text", "test more text")
		cy.get("input").click()
		cy.get("#text").should("have.text", "")
	})
})
