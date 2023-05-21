describe("Multiple applications mounted simultaneously", () => {
	beforeEach(() => {
		cy.visit("/public/examples/multiple-apps/index.html")
	})
	it("interacts with App 1", () => {
		cy.get("#root-1 #text").contains("Initial Text")
		cy.get("#root-1 input").type("Some text")
		cy.get("#root-1 button").click()
		cy.get("#root-1 #text").contains("Some text")
		cy.get("#root-1 input").should("have.value", "")
	})
	it("interacts with App 2", () => {
		cy.get("#root-2 button").click()
		cy.get("#root-2 #counter").contains("1")
	})
	it("interacts with App 1 & App 2", () => {
		// 1
		cy.get("#root-1 input").type("Another text")
		// 2
		cy.get("#root-2 button").click().click()
		cy.get("#root-2 #counter").contains("2")
		// 1
		cy.get("#root-1 button").click()
		cy.get("#root-1 #text").contains("Another text")
		// 2
		cy.get("#root-2 #counter").contains("2")
	})
})
