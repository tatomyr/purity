describe("Dead simple example", () => {
	beforeEach(() => {
		cy.visit("/public/examples/counter/")
	})
	it("passes all the flow", () => {
		cy.get("button#inc").click().click().click()
		cy.get("#count").should("have.text", "3")
		cy.get("button#dec").click()
		cy.get("#count").should("have.text", "2")
		cy.get("button#reset").click()
		cy.get("#count").should("have.text", "0")
	})
})
