describe('Routing', () => {
  it('should go to sibling page', () => {
    cy.visit('http://localhost:8080');
    cy.get('ion-item#routing').click();

    cy.wait(500)

    cy.ionPageVisible('routing')
    cy.ionPageHidden('home')
  });

  it('should set query params and keep view in stack', () => {
    cy.visit('http://localhost:8080/routing');
    cy.get('#route-params').click();
    cy.ionPageVisible('routing');
  });

  it('should go back home', () => {
    cy.visit('http://localhost:8080');
    cy.get('ion-item#routing').click();

    cy.ionBackClick('routing');

    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routing');
  });

  it('should go back home with default href', () => {
    cy.visit('http://localhost:8080/default-href');

    cy.ionBackClick('defaulthref');

    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('defaulthref');
  });

  it('should show back button', () => {
    cy.visit('http://localhost:8080');

    cy.get('#routing').click();
    cy.get('#child').click();

    cy.ionBackClick('routingchild');
    cy.ionBackClick('routing');

    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routing');
    cy.ionPageDoesNotExist('routingchild')
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22359
  it('should navigate to multiple pages that match the same parameterized route', () => {
    cy.visit('http://localhost:8080/routing');

    cy.get('#parameter-abc').click();
    cy.ionPageVisible('routingparameter');
    cy.get('[data-pageid=routingparameter] #parameter-value').should('have.text', 'abc');
    cy.ionBackClick('routingparameter');

    cy.ionPageDoesNotExist('routingparameter');

    cy.get('#parameter-xyz').click();
    cy.ionPageVisible('routingparameter');
    cy.get('[data-pageid=routingparameter] #parameter-value').should('have.text', 'xyz');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22359
  it('should handle parameterized urls properly', () => {
    cy.visit('http://localhost:8080/routing');

    cy.get('#parameter-abc').click();
    cy.ionPageVisible('routingparameter');

    cy.get('#parameter-view').click();

    cy.ionPageVisible('routingparameterview');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22324
  it('should show correct view when navigating back from parameterized page to query string page', () => {
    cy.visit('http://localhost:8080/routing');
    cy.get('#route-params').click();
    cy.get('#parameter-view-item').click();

    cy.ionPageVisible('routingparameterview');
    cy.ionPageHidden('routing');

    cy.ionBackClick('routingparameterview');

    cy.ionPageDoesNotExist('routingparameterview');
    cy.ionPageVisible('routing');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22359
  it('should work properly with async navigation guards', () => {
    cy.visit('http://localhost:8080');
    cy.get('#delayed-redirect').click();

    cy.get('ion-loading').should('exist');

    cy.ionPageVisible('routing');
    cy.ionPageHidden('home');

    cy.ionBackClick('routing');

    cy.ionPageVisible('home');
    cy.ionPageDoesNotExist('routing');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/22412
  it('should correctly replace route in a component', () => {
    cy.visit('http://localhost:8080/routing?ionic:mode=ios');

    cy.get('#replace').click();

    cy.ionPageVisible('navigation');
    cy.ionPageHidden('routing');

    cy.ionSwipeToGoBack(true);
    cy.ionPageVisible('navigation');
  });
});

describe('Routing - Swipe to Go Back', () => {
  beforeEach(() => {
    cy.viewport(320, 568);
    cy.visit('http://localhost:8080?ionic:mode=ios');
    cy.get('#routing').click();
    cy.ionPageHidden('home');
    cy.ionPageVisible('routing')
  });

  it('should swipe and abort', () => {
    cy.ionSwipeToGoBack();
    cy.ionPageHidden('home');
    cy.ionPageVisible('routing');
  });

  it('should swipe and complete', () => {
    cy.ionSwipeToGoBack(true);
    cy.ionPageVisible('home');

    // TODO: Vue router does not go back in cypress with router.back()
    //cy.ionPageDoesNotExist('navigation');
  });
})
