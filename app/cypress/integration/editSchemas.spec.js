/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
describe('Edit schemas', () => {
  beforeEach(function () {
    cy.fixture('simpleSchema').then((simpleSchema) => {
      this.simpleSchema = simpleSchema;
    });
    cy.fixture('invalidSchema').then((invalidSchema) => {
      this.invalidSchema = invalidSchema;
    });
    cy.fixture('simpleUiSchema').then((simpleUiSchema) => {
      this.simpleUiSchema = simpleUiSchema;
    });
    cy.visit('/');
  });

  const cyReplaceTextInFocus = (jsonObject) => {
    cy.focused()
      .type('{cmd}a')
      .type('{del}')
      .type('{ctrl}a')
      .type('{del}')
      .type(JSON.stringify(jsonObject), {
        parseSpecialCharSequences: false,
      });
  };

  const editSchema = (schema, tabSelector) => {
    cy.get(`[data-cy="${tabSelector}"]`).click();
    cy.get('[data-cy="edit-schema"]').click();

    cyReplaceTextInFocus(schema);
    cy.get('[data-cy="apply"]').click();

    cy.get('[data-cy="debug-toggle"]').then(($toggle) => {
      if ($toggle.find('input')[0].checked) {
        $toggle.click();
      }
    });

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
        cyReplaceTextInFocus(schema);
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
        cyReplaceTextInFocus(schema);
        cy.focused().type('{esc}');

        cy.get('[data-cy="schema-text"]').should('have.text', originalText);
      });
  };

  it('Edit JSON Schema', function () {
    editSchema(this.simpleSchema, 'tab-JSON Schema');
  });

  it('Cancel Edit JSON Schema', function () {
    cancelEditSchema(this.simpleSchema, 'tab-JSON Schema');
  });

  it('Escape Edit JSON Schema', function () {
    escapeEditSchema(this.simpleSchema, 'tab-JSON Schema');
  });

  it('Validate invalid JSON Schema', function () {
    cy.get(`[data-cy="tab-JSON Schema"]`).click();

    cy.get('[data-cy="schema-text"]')
      .invoke('text')
      .then((originalText) => {
        cy.get('[data-cy="edit-schema"]').click();
        cyReplaceTextInFocus(this.invalidSchema);
        cy.get('.squiggly-warning').should('exist');
      });
  });

  it('Validate valid JSON Schema', function () {
    cy.get(`[data-cy="tab-JSON Schema"]`).click();

    cy.get('[data-cy="schema-text"]')
      .invoke('text')
      .then((originalText) => {
        cy.get('[data-cy="edit-schema"]').click();
        cyReplaceTextInFocus(this.simpleSchema);
        cy.get('.squiggly-warning').should('not.exist');
      });
  });

  it('Edit UI Schema', function () {
    editSchema(this.simpleUiSchema, 'tab-UI Schema');
  });

  it('Cancel Edit UI Schema', function () {
    cancelEditSchema(this.simpleUiSchema, 'tab-UI Schema');
  });

  it('Escape Edit UI Schema', function () {
    escapeEditSchema(this.simpleUiSchema, 'tab-UI Schema');
  });
});
