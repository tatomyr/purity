describe("Async search", () => {
  beforeEach(() => {
    cy.visit("/public/examples/async-search/index.html")
  })
  it("searches by a query", () => {
    cy.get("input").type("n")
    cy.get("#list li").should("have.length", 9)
    cy.get("#list li").contains("n")
    cy.get("input").should("have.focus").should("have.value", "n")

    cy.get("input").type("dr")
    cy.get("#list li").should("have.length", 1)
    cy.get("#list li").contains("Andrew")
    cy.get("input").should("have.focus").should("have.value", "ndr")

    cy.get("input").type("{backspace}")
    cy.get("#list li").should("have.length", 2)
    cy.get("#list li").contains("nd")
    cy.get("input").should("have.focus").should("have.value", "nd")
  })
  it("searches by a random char", () => {
    let randomChar = "abcdefghijklmnopqrstuvwxyz"[
      Math.floor(Math.random() * 26)
    ]
    cy.get("input").type(randomChar)
    let re = RegExp(`.*${randomChar}.*`, "i")
    cy.get("#list li").should(([...$node]) => {
      console.log("$node--->", $node)
      let eachElementContainsTheChar =
        [...$node].every($el => re.test($el.innerHTML)) && $node.length > 0
      expect(eachElementContainsTheChar).to.equal(true)
    })
    cy.get("input").should("have.focus").should("have.value", randomChar)
  })
  it("shows and hides the error", () => {
    cy.get("input").type("b")
    cy.get("#list li").should("have.length", 1)
    cy.get("#list li").contains("Bartolomew")
    cy.get("input").type("!").should("have.focus").should("have.value", "b!")
    cy.get("#error-banner pre").contains("Fake error").click()
    cy.get("#error-banner pre").should("not.exist")
  })
  it("choose/remove items & handle error in a specific combination", () => {
    cy.get("input").type("andrew")
    cy.get("#list li").should("have.length", 1).contains("Andrew").click()
    cy.get("#list li").click()
    cy.get("#chosen-items li").should("have.length", 1).contains("Andrew")
    cy.get("input").clear().type("k")
    cy.wait(3000)
    cy.get("#list li:first-child").contains("Katherine").click()
    cy.get("#chosen-items li").should("have.length", 2).contains("Katherine")
    cy.get("#chosen-items li:first-child").click()
    cy.get("#chosen-items li").should("have.length", 1).contains("Katherine")

    cy.get("input").type("!")
    cy.get("input").should("have.focus").should("have.value", "k!")
    cy.get("#error-banner pre").contains("Fake error")

    cy.get("#list li:last-child").contains("Mark").click()

    cy.get("#chosen-items li").should("have.length", 2).contains("Katherine")
    cy.get("#chosen-items li:first-child").click()
    cy.get("#chosen-items li").should("have.length", 1).contains("Mark")

    cy.get("#error-banner pre").click()
    cy.get("#error-banner pre").should("not.exist")
  })
  it("handles many clicks on long lists", () => {
    cy.get("input").type("n")
    cy.get("#list li").should("have.length", 9)
    cy.get("#list li:nth-child(1)").click()
    cy.get("#list li:nth-child(2)").click()
    cy.get("#list li:nth-child(3)").click()
    cy.get("#list li:nth-child(4)").click()
    // Send the request to simulate error
    cy.get("input").type("!")
    cy.get("#list li:nth-child(5)").click()
    cy.get("#list li:nth-child(6)").click()
    cy.get("#list li:nth-child(7)").click()
    cy.get("#list li:nth-child(8)").click()
    cy.get("#list li:nth-child(9)").click()
    cy.get(".chosen-items li").should("have.length", 9)
    cy.get(".chosen-items").contains("Andrew")
    cy.get(".chosen-items").contains("Catalyna")
    cy.get(".chosen-items").contains("Donald")
    cy.get(".chosen-items").contains("Fernando")
    cy.get(".chosen-items").contains("Houston")
    cy.get(".chosen-items").contains("John")
    cy.get(".chosen-items").contains("Katherine")
    cy.get(".chosen-items").contains("Quentin")
    cy.get(".chosen-items").contains("Xenia")
    cy.get("#error-banner pre")
      .contains("Fake error")
      .click()
      .should("not.exist")
    cy.get(".chosen-items li:first-child").click()
    cy.get(".chosen-items li").should("have.length", 8)
  })
})
