/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    customCommand(): Chainable<any>;
  }
}
