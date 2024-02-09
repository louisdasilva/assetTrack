const { expect } = require('chai');
const { addCards, countValidParts, populateTable, openForm, validateFormData } = require('../scripts/inventoryScript');
const { JSDOM } = require('jsdom');

const mockJQuery = require('jquery');
const mockDocument = {
    ready: (callback) => callback(),
};
const mockWindow = {
    $: mockJQuery,
    document: mockDocument,
};
global.window = mockWindow;
global.document = mockDocument;

describe("INVENTORY FUNCTION TEST SUITE \n --------------------------------", function() {

        describe('Function Test (countValidParts)', function () {

            it('Verify Count with Duplicate Parts in Array', function () {
                const inputArray = ["wing", "fuselage", "engine", "landing gear", "wing", "tail", "fuselage", "cockpit", "wing"];
                const partCount = countValidParts(inputArray);
                //Assertion:
                expect(partCount).to.deep.equal({ wing: 3, fuselage: 2, "landing gear": 1, engine: 1, tail: 1, cockpit: 1 });
            });
            it('Verify Count with Varied Case in Array', function () {
                const inputArray = ["Wing", "fuselage", "eNgine", "TAIL", "landing gear", "cockpit"];
                const partCount = countValidParts(inputArray);
                // Assertion:
                expect(partCount).to.deep.equal({ wing: 1, fuselage: 1, "landing gear": 1, engine: 1, tail: 1, cockpit: 1 });
            });
            it('Verify Count with Non-Part Elements in Array', function () {
                const inputArray = ["wing", "fuselage", "engine", "building", "landing gear", "plane", "tree"];
                const partCount = countValidParts(inputArray);
                // Assertion:
                expect(partCount).to.deep.equal({ wing: 1, fuselage: 1, engine: 1, "landing gear": 1 });
            });
            it('Verify Count with Null and Undefined Elements in Array', function () {
                const inputArray = ["wing", null, , undefined, "fuselage", "engine"];
                const partCount = countValidParts(inputArray);
                // Assertion:
                expect(partCount).to.deep.equal({ wing: 1, fuselage: 1, engine: 1 });
            });
            it('Verify Count with Empty Array', function () {
                const inputArray = [""];
                const partCount = countValidParts(inputArray);
                expect(partCount).to.deep.equal({});
            });
    });

    describe('Function Test (addCards)', () => {
        beforeEach(() => {
            // RESET GLOBAL DOCUMENT ENVIRONMENT BEFORE TEST
            const dom = new JSDOM('<html><body><div id="card-section"></div></body></html>');
            global.document = dom.window.document;
        });

        // MOCK DATA
        const VALID_ITEMS = [
            { partName: 'Wing', partFamily: 'wing', partNumber: 'wing-1', partPath: 'wing.jpg', description: 'This is a description' },
            { partName: 'Window', partFamily: 'fuselage', partNumber: 'window-2', partPath: 'window.jpg', description: 'This is another description' },
        ];
        const INVALID_PART_FAMILY = [
            { partName: 'Wing', partFamily: 'pineapple', partNumber: 'wing-1', partPath: 'wing.jpg', description: 'This is a description' },
            { partName: 'Window', partFamily: 'peach', partNumber: 'window-2', partPath: 'window.jpg', description: 'This is another description' },
        ];
        const EMPTY_ITEMS = [
            { partName: 'Wing', partFamily: '', partNumber: 'wing-1', partPath: 'wing.jpg', description: 'This is a description' },
            { partName: 'Window', partFamily: 'null', partNumber: 'window-2', partPath: 'window.jpg', description: 'This is another description' },
            { partName: 'Window', partFamily: 'undefined', partNumber: 'window-2', partPath: 'window.jpg', description: 'This is another description' },
            { partName: 'Wing', partFamily: 'wing', partNumber: 'wing-1', partPath: 'wing.jpg', description: 'This is a description' },
        ];

        // TESTS
        it('Verify Cards Added & Properties Matching Based on Input', function () {
            addCards(VALID_ITEMS);
            const cardElements = document.querySelectorAll('.card');
            expect(cardElements).to.have.lengthOf(VALID_ITEMS.length);

            cardElements.forEach((cardElement, index) => {
                expect(cardElement.querySelector('.card-title').textContent).to.equal(VALID_ITEMS[index].partName);
                expect(cardElement.querySelector('.card-partFamily').textContent).to.equal(VALID_ITEMS[index].partFamily);
                expect(cardElement.querySelector('.card-text').textContent).to.equal(VALID_ITEMS[index].description);
            });
        });

        it('Correctly Handle No Matching partFamily Input in Array', function () {
            addCards(INVALID_PART_FAMILY);
            const cardElements = document.querySelectorAll('.card');
            expect(cardElements).to.have.lengthOf(0);
        });

        it('Correctly Handle Null, Undefined and Empty partFamilyInput', function () {
            addCards(EMPTY_ITEMS);
            const cardElements = document.querySelectorAll('.card');
            expect(cardElements).to.have.lengthOf(1);
        });

        // CLEAN UP
        after(function () {
            delete global.window;
            delete global.document;
        });
    });

    describe('Function Test (populateTable)', function () {
        beforeEach(() => {
            // RESET GLOBAL DOCUMENT ENVIRONMENT BEFORE TEST
            const dom = new JSDOM('<html><body><div id="table"></div></body></html>');
            global.document = dom.window.document;
        });

        // MOCK DATA
        const partCount = { wing: 2, fuselage: 0, 'landing gear': 1, engine: 3 };

        // TESTS
        it('Verify Table Populated Correctly Based on Input', function () {
            populateTable(partCount, "");

            const tableElement = document.querySelector('table');
            expect(tableElement).to.exist;
            const rows = tableElement.querySelectorAll('tr');
            expect(rows.length).to.equal(4); // CHECK 4 ROWS
            expect(rows[1].textContent).to.include('wing');
            expect(rows[1].textContent).to.include('2');
            expect(rows[2].textContent).to.include('landing gear');
            expect(rows[2].textContent).to.include('1');
        });

        it('Verify Table Not Populated for Empty Part Count', function () {
            populateTable({}, "");
            const tableElement = document.querySelector('table');
            expect(tableElement).to.not.exist;
        });

        // CLEAN UP
        after(function () {
            delete global.window;
            delete global.document;
        });
    });

    describe('Function Test (validateFormData)', function () {
        beforeEach(() => {
            const dom = new JSDOM('<html><body>' +
                '<div id="PartNameFeedbackText"></div>' +
                '<div id="PartNumberFeedbackText"></div>' +
                '<div id="PartFamilyFeedbackText"></div>' +
                '<div id="DescriptionFeedbackFeedbackText"></div>' +
                '</body></html>'
            );
            global.document = dom.window.document;
        });
       
        it('All Necessary Input fields are populated', () => {
            const formData = {
                partName: 'Wing', partNumber: 'W1', partFamily: 'wing', description: 'This is a description.' };
            expect(validateFormData(formData)).to.be.true;
        });

        it('An Input field is empty', () => {
            const formData = { partName: '', partNumber: '', partFamily: null, description: '' };
            expect(validateFormData(formData)).to.be.false;
        });
    
        it('Display error messages if any field is empty', () => {
            const formData = { partName: '', partNumber: '', partFamily: null, description: '' };
            validateFormData(formData);
            expect(document.getElementById('PartNameFeedbackText').textContent).to.equal('Enter a Part Name.');
            expect(document.getElementById('PartNumberFeedbackText').textContent).to.equal('Enter a Part Number.');
            expect(document.getElementById('PartFamilyFeedbackText').textContent).to.equal('Select a Part Family.');
            expect(document.getElementById('DescriptionFeedbackFeedbackText').textContent).to.equal('Enter a Description.');
        });
    
        // CLEAN UP
        after(function () {
            delete global.window;
            delete global.document;
        });
    });
});


































    // describe('Function Test (openForm)', function () {
    //     beforeEach(() => {
    //         // RESET GLOBAL DOCUMENT ENVIRONMENT BEFORE TEST
    //         const dom = new JSDOM('<html><body><div id="card-section"></div></body></html>');
    //         global.document = dom.window.document;
    //     });

    //     // MOCK DATA
    //     const VALID_INPUT = [
    //         { partName: 'Wing', partFamily: 'wing', partNumber: 'wing-1', partPath: 'wing.jpg', description: 'This is a description', _id: "123456789"  },
    //         { partName: 'Window', partFamily: 'fuselage', partNumber: 'window-2', partPath: 'window.jpg', description: 'This is another description', _id: "1234567891"  },
    //     ];
    //     const DATABASE_ITEMS = [
    //         { partName: 'Wing', partFamily: 'wing', partNumber: 'wing-1', partPath: 'wing.jpg', description: 'This is a description', _id: "123456789" },
    //         { partName: 'Window', partFamily: 'fuselage', partNumber: 'window-2', partPath: 'window.jpg', description: 'This is another description', _id: "1234567891" },
    //     ];

    //     it('Correctly attach update event listeners to cards', () => {
    //         addCards(VALID_INPUT);
    //         openForm(DATABASE_ITEMS);
            
    //         const updateCardButton = document.querySelector('.update-card');

    //         updateCardButton.click();
    
    //         expect(document.getElementById('partName').value).to.equal(DATABASE_ITEMS[0].partName);
    //     });

    //     // CLEAN UP
    //     after(function () {
    //         delete global.window;
    //         delete global.document;
    //     });
    // });