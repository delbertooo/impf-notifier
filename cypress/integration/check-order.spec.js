
const locations = [
    'IST Erfurt 1 HELIOS (barrierefrei) | Vormittag',
    'IST Erfurt 1 HELIOS (barrierefrei) | Nachmittag',
    'IST Erfurt 2 KKH (barrierefrei) | Vormittag',
    'IST Erfurt 2 KKH (barrierefrei) | Nachmittag',
];

// IST Sömmerda (barrierefrei) | Nachmittag
describe('Impf-Terminvergabe Thüringen', () => {
    locations.forEach((l,i) => {
    it(`dates is empty for [${i}] "${l}"`, () => {
        cy.on('uncaught:exception', (err, runnable) => false) // we don't care about errors
        cy.visit('https://www.impfen-thueringen.de/terminvergabe/')
        cy.intercept('Impf-Termine buchen')

        cy.intercept('https://www.impfen-thueringen.de/terminvergabe/func.php').as('funcphp')

        cy.get('#select2-select-indi-container').click()
        cy.get('.select2-results').contains('Indikation nach Alter (STIKO) > 80 J.').click()

        cy.get('#select2-select-ort-container').click()
        cy.get('.select2-results').contains(l).click()

        cy.wait(['@funcphp', '@funcphp'])
        cy.wait(5000)

        cy.get('select[name="DatumUhrzeit"] optgroup').should('have.length', 0)
        
    })
})
})
