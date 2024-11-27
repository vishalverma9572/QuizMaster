describe('Quiz Master App Tests', () => {

  it('Home page is shown', () => {
    cy.visit('http://localhost:3000')
    cy.wait(500)
    cy.contains('Quiz Master')
    cy.contains('Your ultimate destination to create quizzes and take quizzes. Join us to challenge your knowledge and improve your skills in a fun and engaging way.')
  })

  it('Sign In form is shown', function() {
    cy.visit('http://localhost:3000/login')
    cy.get('.form').should('exist')
    cy.get('#email').should('exist')
    cy.get('#password').should('exist')
    cy.get('.button').should('exist')
  })

  it('fails with wrong credentials', function() {
    cy.visit('http://localhost:3000/login')
    cy.get('.form').should('exist')
    cy.get('#email').type('wrong@email.com')
    cy.get('#password').type('wrongpassword') 
    cy.get('.button').click()

    cy.get('.error')
      .should('contain', 'Invalid credentials')
  })

  it('succeeds with correct credentials', function() {
    cy.visit('http://localhost:3000/login')
    cy.get('#email').type('testuser@email.com')
    cy.get('#password').type('Testpassword123')
    cy.get('.button').click()

    cy.url().should('include', '/dashboard');
  })

})

