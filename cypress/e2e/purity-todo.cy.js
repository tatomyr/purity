describe('Purity todo example', () => {
  beforeEach(() => {
    cy.visit('/public/examples/purity-todo/')
  })
  it('adds, completes and removes tasks', () => {
    // Adds a new item and resets the input
    cy.get('#task-form input').type('first').type('{enter}')
    cy.get('ol#task-list li').contains('div.item-description', 'first')
    cy.get('#task-form input').should('have.value', '')

    // Should not show the delete button
    cy.get('ol#task-list li')
      .contains('div.item-description', 'first')
      .get('button.delete-button')
      .should('have.class', 'hidden')

    // Should add another item
    cy.get('#task-form input').type('second').type('{enter}')
    cy.get('ol#task-list li').should('have.length', 2)
    cy.get('ol#task-list li:first-child').contains(
      'div.item-description',
      'second'
    )

    // Should indicate that all tasks are active
    cy.get('#header li#active button').should('have.class', 'chosen')
    cy.get('#header li#completed button').should('not.have.class', 'chosen')

    // Marks the first item as completed
    cy.wait(1000) // Delay because of async nature of Purity (?)
    cy.get('ol#task-list li:nth-child(2) button.toggle-button').click()
    cy.get('ol#task-list li:nth-child(2) button.toggle-button').contains('⊠')

    // Should indicate that there are active and completed tasks
    cy.get('#header li#active button').should('have.class', 'chosen')
    cy.get('#header li#completed button').should('have.class', 'chosen')

    // Should show the delete button
    cy.get('ol#task-list li:nth-child(2) button.delete-button').should(
      'not.have.class',
      'hidden'
    )

    // Removes the first task
    cy.get('ol#task-list li:nth-child(2) button.delete-button').click()
    cy.get('ol#task-list li').should('have.length', 1)
    cy.get('ol#task-list li').should('not.have.value', 'first')

    // Should indicate that all tasks are active
    cy.get('#header li#active button').should('have.class', 'chosen')
    cy.get('#header li#completed button').should('not.have.class', 'chosen')
  })
})
