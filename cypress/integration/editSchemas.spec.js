/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2020 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
describe('Edit schemas', () => {
  beforeEach(function () {
    cy.fixture('simpleSchema').then((simpleSchema) => {
      this.simpleSchema = simpleSchema;
    });
    cy.fixture('simpleUiSchema').then((simpleUiSchema) => {
      this.simpleUiSchema = simpleUiSchema;
    });
    cy.visit('/');
  });

  const editSchema = (schema, tabSelector) => {
    cy.get(`[data-cy="${tabSelector}"]`).click();
    cy.get('[data-cy="edit-schema"]').click();

    cy.focused().type('{ctrl}a').type('{del}').type(JSON.stringify(schema), {
      parseSpecialCharSequences: false,
    });
    cy.get('[data-cy="apply"]').click();

    cy.get('[data-cy="schema-text"]').should(
      'have.text',
      JSON.stringify(schema, null, 2)
    );
  };

  const cancelEditSchema = (schema, tabSelector) => {
    cy.get(`[data-cy="${tabSelector}"]`).click();

    cy.get('[data-cy="schema-text"]')
      .invoke('text')
      .then((originalText) => {
        cy.get('[data-cy="edit-schema"]').click();
        cy.focused()
          .type('{ctrl}a')
          .type('{del}')
          .type(JSON.stringify(schema), {
            parseSpecialCharSequences: false,
          });
        cy.get('[data-cy="cancel"]').click();

        cy.get('[data-cy="schema-text"]').should('have.text', originalText);
      });
  };

  const escapeEditSchema = (schema, tabSelector) => {
    cy.get(`[data-cy="${tabSelector}"]`).click();

    cy.get('[data-cy="schema-text"]')
      .invoke('text')
      .then((originalText) => {
        cy.get('[data-cy="edit-schema"]').click();
        cy.focused()
          .type('{ctrl}a')
          .type('{del}')
          .type(JSON.stringify(schema), {
            parseSpecialCharSequences: false,
          });
        cy.focused().type('{esc}');

        cy.get('[data-cy="schema-text"]').should('have.text', originalText);
      });
  };

  it('Edit JSON Schema', function () {
    editSchema(this.simpleSchema, 'schema-tab');
  });

  it('Cancel Edit JSON Schema', function () {
    cancelEditSchema(this.simpleSchema, 'schema-tab');
  });

  it('Escape Edit JSON Schema', function () {
    escapeEditSchema(this.simpleSchema, 'schema-tab');
  });

  it('Edit UI Schema', function () {
    editSchema(this.simpleUiSchema, 'uischema-tab');
  });

  it('Cancel Edit UI Schema', function () {
    cancelEditSchema(this.simpleUiSchema, 'uischema-tab');
  });

  it('Escape Edit UI Schema', function () {
    escapeEditSchema(this.simpleUiSchema, 'uischema-tab');
  });
});
