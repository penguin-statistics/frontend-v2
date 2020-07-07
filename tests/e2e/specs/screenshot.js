// https://docs.cypress.io/api/introduction/api.html

describe('preview screenshots', () => {
  it('should take screenshot of homepage', () => {
    cy.visit('/')
    cy.screenshot('homepage')
  })
})
