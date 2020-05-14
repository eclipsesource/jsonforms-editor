describe('Smoketest', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Renders Title', () => {
    cy.contains('JSON Forms Editor');
  });
});
