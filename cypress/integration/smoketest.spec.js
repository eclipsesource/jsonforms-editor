describe('Smoketest', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Renders Learn React', () => {
    cy.contains('Learn React');
  });
});
