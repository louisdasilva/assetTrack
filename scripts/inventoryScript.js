const socket = io();
let appliedFilters = [];
let searchInput = {};
let filterButtonsContainer = $('#filterButtonsContainer');
let cardsSection = $('#card-section'); // GET CARD SECTION
let cardID = "Empty";

// ARRAY OF ALL VALID PART FAMILIES -> GLOABL SCOPE AS USED BY MULTIPLE METHODS
const VALID_PARTS = [ "wing" , "fuselage" , "tail" , "engine" , "landing gear" , "cockpit" ];

// COUNT TOTAL NUMBER OF VALID PARTS PER PART FAMILY
function countValidParts(arr) {
    let partCount = {};

    arr.forEach((part) => {
        if (part != "") {
            let lowerCasePart;
            if (part != null && part != undefined) {
                lowerCasePart = part.toLowerCase(); //lowercase to match the static validParts array.
            }
    
            if (VALID_PARTS.includes(lowerCasePart)) {
                // Use lowerCasePart string to index the array - use || 0 as default if null etc. and increment count
                partCount[lowerCasePart] = (partCount[lowerCasePart] || 0) + 1;
            }
        }
    else { /*console.log("Empty partFamily Input")*/ }
    });
    // console.log(partCount);
    return partCount
}

// DYNAMICALLY CREATE & UPDATE PART FAMILY COUNT TABLE ON WEBPAGE
const populateTable = (partCount, tableSection) => {
    // Object.keys(partCount) returns an array of strings representing name-key pairs. Then I'm filtering out those equal to 0.
    const validParts = Object.keys(partCount).filter(part => partCount[part] > 0);
    
    if(validParts.length > 0) //Only execute if array is not empty - Condition is required for edge case when I delete every card - I don't want the table heading to show
    {
        // Create table
        let tableHTML = '<table style="margin-bottom: 100px;">' +
                        '<thead><tr><th>Part Family</th><th>Number</th></tr></thead>' +
                        '<tbody>';
        // Populate table with both name and number
        validParts.forEach((part) => {
            const count = partCount[part];
            tableHTML += `<tr><td>${part}</td><td>${count}</td></tr>`;
        });
        tableHTML += '</tbody></table>'; // Close table
        tableSection = document.getElementById('table');
        tableSection.innerHTML = tableHTML;
        // console.log(tableHTML);
    }
}

// DYNAMICALLY ADD CARDS TO WEBPAGE
const addCards = (items) => {

    items.forEach(item => {
        if(item.partFamily == null || item.partFamily == undefined || item.partFamily == "") { /*console.log("Null, Undefined OR Empty Card subTitle")*/ }
        else {
            let lowerCasePart = item.partFamily.toLowerCase(); //lowercase to match the static validParts array.
            if (VALID_PARTS.includes(lowerCasePart)) {
                let itemToAppend = document.createElement('div');
                itemToAppend.innerHTML = '<div class="col s4 center-align">'+
                        '<div class="card medium"><div class="card-image waves-effect waves-block waves-light"><img class="activator" src="images/'+item.path+'">'+
                        '</div><div class="card-content">'+
                        `<span class="card-title activator grey-text text-darken-4">${item.partName}<i class="material-icons right"></i></span><p><a href="#"></a></p></div>`+
                        '<div class="card-reveal">'+
                        '<span class="card-partFamily grey-text text-darken-4">'+item.partFamily+'<i class="material-icons right"></i></span>'+
                        '<p class="card-text">'+item.description+'</p>'+
                        '</div>'+
                        '<div class="card-action">'+
                        `<button class="btn update-card" style="margin-right: 10px;" data-card-id="${item._id}">Update</button>`+
                        `<button class="btn remove-card" data-card-id="${item._id}">Remove</button>`+
                        '</div>'+
                        '</div></div>';
                document.getElementById('card-section').appendChild(itemToAppend);
            } 
        }
    });
    // Listen for remove card click
    document.querySelectorAll('.remove-card').forEach(button => {
        button.addEventListener('click', function() {
          const cardId = this.getAttribute('data-card-id');
          removeCard(cardId);
        });
    });
};

function resetFormInput() {
    // Grab input elements
    let partName = $('#partName');
    let partFamily = $('#partFamily');
    let partNumber = $('#partNumber');
    let partPath = $('#path');
    let partDescription = $('#description');
    // Clear input values
    partName.val('');
    partFamily.val('');
    partNumber.val('');
    partPath.val('');
    partDescription.val('');
    // Remove highlighting and focus by updating CSS classes
    partName.removeClass('valid');
    partFamily.removeClass('valid');
    partNumber.removeClass('valid');
    partPath.removeClass('valid');
    partDescription.removeClass('valid');
    partName.removeClass('invalid');
    partFamily.removeClass('invalid');
    partNumber.removeClass('invalid');
    partPath.removeClass('invalid');
    partDescription.removeClass('invalid');
    // Reset Input Heading Placement
    M.updateTextFields();
    // Reset Feedback Text
    document.getElementById("PartNameFeedbackText").textContent = "";
    document.getElementById("PartNumberFeedbackText").textContent = "";
    document.getElementById("PartFamilyFeedbackText").textContent = "";
    document.getElementById("DescriptionFeedbackFeedbackText").textContent = "";
}

function openForm(items) {

    let partName = document.getElementById('partName');
    let partFamily = document.getElementById('partFamily');
    let partNumber = document.getElementById('partNumber');
    let partPath = document.getElementById('path');
    let partDescription = document.getElementById('description');

    // Listen for update card click
    document.querySelectorAll('.update-card').forEach(button => {
        button.addEventListener('click', function() {
            const CARD_ID = this.getAttribute('data-card-id');
            const CARD_DETAILS = items.find(item => item._id == CARD_ID);

            partName.value = CARD_DETAILS.partName;
            partFamily.value = CARD_DETAILS.partFamily;
            partNumber.value = CARD_DETAILS.partNumber;
            partPath.value = CARD_DETAILS.path;
            partDescription.value = CARD_DETAILS.description;

            // Use Materialize method to open the modal
            let instance = M.Modal.getInstance(document.getElementById('modal1'));
            instance.open();

            partName.focus(); partFamily.focus(); partNumber.focus(); partPath.focus(); partDescription.focus();
            partName.blur(); partFamily.blur(); partNumber.blur(); partPath.blur(); partDescription.blur();
            
            // Reset Feedback Text
            document.getElementById("PartNameFeedbackText").textContent = "";
            document.getElementById("PartNumberFeedbackText").textContent = "";
            document.getElementById("PartFamilyFeedbackText").textContent = "";
            document.getElementById("DescriptionFeedbackFeedbackText").textContent = "";
        });
    });
}

function getPartID(callback) {
    document.querySelectorAll('.update-card').forEach(button => {
        button.addEventListener('click', function() {
            cardID = this.getAttribute('data-card-id');
            console.log(cardID);
            if (callback) {
                callback(cardID);
            }
        });
    });

    const button = document.querySelector('#clickMeButton');
    button.addEventListener('click', function() {
        cardID = "NEW_PART";
        console.log(cardID);
        if (callback) {
            callback(cardID);
        }
    });
}

// EXTRACT CLIENT FORM INPUT INFORMATION
const getAllUserInput = () => {
    let formData = {};
    formData.partName = $('#partName').val();
    formData.partFamily = $('#partFamily').val();
    formData.partNumber = $('#partNumber').val();
    formData.path = $('#path').val();
    formData.description = $('#description').val();

    return formData;
}

function addOrUpdatePart(formData, cardID) {
    if (cardID == "Empty") {
        console.log("Error - Could not manage ID")
    }
    else if (cardID == "NEW_PART") {
        postPart(formData);
    }
    else {
        updatePart(cardID, formData);
    }
}

function validateFormData(formData) {
    let partNameFeedback = document.getElementById("PartNameFeedbackText");
    let partNumberFeedback = document.getElementById("PartNumberFeedbackText");
    let partFamilyFeedback = document.getElementById("PartFamilyFeedbackText");
    let partDescriptionFeedback = document.getElementById("DescriptionFeedbackFeedbackText");
    
    let validInput = true; 

    if (formData.partName == "") {
        partNameFeedback.textContent = "Enter a Part Name.";
        validInput = false;
    } else {
        partNameFeedback.textContent = "";
    }
    if (formData.partNumber == "") {
        partNumberFeedback.textContent = "Enter a Part Number.";
        validInput = false;
    } else {
        partNumberFeedback.textContent = "";
    }
    if (formData.partFamily == null) {
        partFamilyFeedback.textContent = "Select a Part Family.";
        validInput = false;
    } else {
        partFamilyFeedback.textContent = "";
    }
    if (formData.description == "") {
        partDescriptionFeedback.textContent = "Enter a Description.";
        validInput = false;
    } else {
        partDescriptionFeedback.textContent = "";
    }

    return validInput;
}



// DYNAMICALLY CREATE FILTER BUTTONS BASED ON SEARCH INPUT
// -------------------------------------------------------
const createFilterButtonsBasedOnSearchInput = (allParts) => {
    searchInput = $('#searchInput').val(); // GET USER SEARCH INPUT
    
    if (!appliedFilters.includes(searchInput)) { // CHECK IF THE SEARCH INPUT IS ALREADY A FILTER
        appliedFilters.push(searchInput); // ADD NEW SEARCH INPUT TO LIST OF APPLIED FILTERS
        filterButtonsContainer.empty(); // REMOVE ALL FILTER BUTTONS
        // ADD ALL FILTER BUTTONS INCLUDING NEW INPUT
        appliedFilters.forEach(filter => {
            // ATTACH HTML & FILTER NAME
            let filterButton = $('<button>', {
                class: 'waves-effect waves-light btn-small remove-filter-btn filter-button',
                html: `<i class="material-icons left">close</i>${filter}`
            });
            filterButton.attr('data-filter', filter); // ADD DATA ATTRIBUTE TO REFER TO FOR DELETION
            // ATTACH REMOVE FILTER FUNCTION ONCLICK
            filterButton.click(() => {
                removeFilterFromArray(filter);
                hideFilterButton(filter);
                cardsSection.empty(); // CHANGE CARD SECTION TO EMPTY
                const FILTERED_PARTS_ARRAY = returnUserFilteredPartsInArray(allParts); // AN ARRAY OF PART OBJECTS
                const FILTERED_COMPONENTS_COUNT = returnUserFilteredComponentsAndCountsAsObject(allParts); // E.G. {wing: 2, fuselage: 1}
                if (appliedFilters.length == 0) { // CHECK NO FILTERS ARE APPLIED
                    location.reload(true); // REFRESH PAGE
                }
                else { 
                    addCards(FILTERED_PARTS_ARRAY); // ADD CARDS MATCHING SEARCH INPUT FILTER FROM COLLECTION
                    populateTable(FILTERED_COMPONENTS_COUNT, ""); // CREATE TABLE WITH ALL COMPONENTS FROM COLLECTION
                }
            });
            filterButtonsContainer.append(filterButton); // APPEND ALL REMOVE FILTER BUTTONS TO CONTAINER IN HTML
        });
        $('#filterLabel').show(); // SHOW FILTERS HEADING
    }
    else { 
        alert("Filter already applied");
    }
    $('#searchModal').modal('close'); // CLOSE SEARCH MODAL
}

function updateDisplayBasedOnFilters(allParts) {
    const FILTERED_PARTS_ARRAY = returnUserFilteredPartsInArray(allParts);
    const FILTERED_COMPONENTS_COUNT = returnUserFilteredComponentsAndCountsAsObject(allParts);
    cardsSection.empty(); // REMOVE ALL CARDS FROM CARD SECTION
    populateTable(FILTERED_COMPONENTS_COUNT, ""); // CREATE TABLE WITH FILTERED COMPONENTS AND COUNTS
    addCards(FILTERED_PARTS_ARRAY); // ADD FILTERED CARDS
    openForm(allParts);
    getPartID();
}

function returnUserFilteredPartsInArray(allParts) {
        let filteredArrays = [];
        // Iterate over each applied filter
        appliedFilters.forEach(appliedFilter => {
            // Filter the parts based on the current applied filter
            let filteredParts = allParts.filter(part => part.partFamily === appliedFilter);
            // Push the filtered parts to the array
            filteredArrays.push(filteredParts);
        });
        // Combine all filtered arrays into a single array (using flatMap for this purpose)
        const FILTERED_PARTS_ARRAY = filteredArrays.flatMap(filteredParts => filteredParts);
        return FILTERED_PARTS_ARRAY
}

function returnUserFilteredComponentsAndCountsAsObject(allParts) {
    let filteredComponentsCount = {};

    appliedFilters.forEach(appliedFilter => {
        // COUNT PARTS FOR EACH APPLIED FILTER
        filteredComponentsCount[appliedFilter] = allParts.filter(part => part.partFamily === appliedFilter).length;
    });
    return filteredComponentsCount;
}

function removeFilterFromArray(filterToRemove) {
    const indexToRemove = appliedFilters.indexOf(filterToRemove); // GET INDEX OF FILTER TO REMOVE
    if (indexToRemove !== -1) { // IF INDEX OF FILTER FOUND
        appliedFilters.splice(indexToRemove, 1); // REMOVE THAT INDEX
    }
    return appliedFilters;
}

function hideFilterButton(filterToRemove) {
    if (appliedFilters.length == 0) { // CHECK IF NO FILTERS APPLIED
        $('#filterLabel').hide(); // HIDE FILTER LABEL
    }
    $(`.remove-filter-btn[data-filter="${filterToRemove}"]`).hide(); // HIDE FILTER BUTTON
}

// << SEND POST REQUEST TO SERVER >>
// ---------------------------------
function postPart(part){
    console.log('Sending POST request with data:', part);
    // SEND PART OBJECT TO /api/part ENDPOINT USING AJAX
    $.ajax({
        url:'/api/part',
        type:'POST',
        // ENSURE OBJECT IS JSON FORMAT
        data: JSON.stringify(part),  // Convert data to JSON string
        contentType: 'application/json',  // Specify content type
        // TRIGGER ALERTS DEPENDING ON POST RESULT 
        // ----------------------------------------
        error: (xhr) => {
            if (xhr.status === 400) { alert('ERROR: Empty or Invalid Input'); } 
            else { console.log('Error: ' + xhr.statusText); }
        },
        success: () => { 
            socket.emit('addPart', part.partFamily); // EMIT 'addPart' event to the server
            localStorage.setItem('postSuccess', 'true'); // STORE IN MEMORY POST SUCCESS
            location.reload(true); // REFRESH PAGE
        }
    });
}

function updatePart(cardID, formData) {
    $.ajax({
        url: `/api/part/${cardID}`, // Pass cardID in the URL
        type: 'PUT', // Assuming you use PUT method for updates
        data: JSON.stringify(formData),
        contentType: 'application/json',
        error: (xhr) => {
            if (xhr.status === 404) {
                alert('ERROR: Part not found');
            } else {
                console.log('Error: ' + xhr.statusText);
            }
        },
        success: () => {
            socket.emit('updatePart', cardID); // Emit 'updatePart' event to the server
            localStorage.setItem('postUpdateSuccess', 'true'); // STORE IN MEMORY POST SUCCESS
            location.reload(true); // Refresh page
        }
    });
}

// << SEND DELETE REQUEST TO SERVER >>
// -----------------------------------
function removeCard(cardId) {
    // SEND REQUEST TO DELETE THE OBJECT WITH MATCHING CARDID
    $.ajax({
        url: `/api/part/${cardId}`,
        type: 'DELETE',
        error: (xhr) => { console.log('ERROR: ' + xhr.statusText); },
        success: () => {
            // REMOVE CARD FROM DOM 
            $(`.remove-card[data-card-id="${cardId}"]`).closest('.col').remove();
            socket.emit('removePart', ""); // EMIT 'removePart' event to the server
            localStorage.setItem('deleteSuccess', 'true');
            location.reload(true); // REFRESH PAGE
        }
    });
}

// << SEND REQUEST TO RETRIEVE ALL PARTS FROM SERVER >>
// ----------------------------------------------------
function getAllParts() {
    return new Promise((resolve, reject) => {
        $.get('/api/parts', (response) => {
            if (response.statusCode === 200) {
                resolve(response.data);
            } else {
                reject(new Error("Failed to execute getAllParts"));
            }
        });
    });
}

// << WEBSOCKETS >>
// Listen for 'partAdded' event from client.
socket.on('partAdded', (part) => {
    alert(`A Client Added A Part: "${part}". Refresh to see changes.`); //alert this client
});
// Listen for 'removePart' event from client
socket.on('partRemoved', (part) => {
    alert("A Client Removed A Part. Refresh to see changes.");  //alert this client
});

function checkNotifications() {
    if (localStorage.getItem('postSuccess')) {
        showNotification("Part Added Successfully", "green");
        localStorage.removeItem('postSuccess'); // CLEAR
    }
    if (localStorage.getItem('deleteSuccess')) {
        showNotification("Part Removed Successfully", "red");
        localStorage.removeItem('deleteSuccess');
    }
    if (localStorage.getItem('postUpdateSuccess')) {
        showNotification("Part Updated Successfully", "green");
        localStorage.removeItem('postUpdateSuccess'); // CLEAR
    }


}

function showNotification(message, colour) {
    const notificationStyle = {
        html: message,
        classes: `rounded ${colour} darken-2 centered-notification`,
        displayLength: 5000, // Duration to display in milliseconds
        inDuration: 300,
        outDuration: 300, 
        activationPercent: 0.8,
    };
    M.toast(notificationStyle);
}

// << MAIN METHIOD >>
// ------------------
const initialiseDOM = async () => {
    try {
        const ALL_PARTS_ARRAY = await getAllParts(); // CREATE ARRAY OF ALL OBJECTS IN THE PARTS COLLECTION
        const ALL_COMPONENTS_ARRAY = ALL_PARTS_ARRAY.map(part => part.partFamily); // CREATE ARRAY OF ALL COMPONENTS IN THE PARTS COLLECTION E.G. { wing, fuselage, wing }
        const COMPONENT_COUNT = countValidParts(ALL_COMPONENTS_ARRAY); // CREATE OBJECT OF ALL COMPONENTS AND THEIR COUNT IN PARTS COLLECTION E.G. { wing: 2, fuselage: 3 }
        populateTable(COMPONENT_COUNT, ""); // CREATE COMPONENT TABLE WITH COUNT OF DIFFERENT COMPONENTS
        addCards(ALL_PARTS_ARRAY); // CREATE A CARD FOR EACH PART IN COLLECTION
        openForm(ALL_PARTS_ARRAY);
        getPartID(); //SET ID's OF EVERY UPDATE BUTTON

        $(document).ready(function () {
            checkNotifications();
            $('.materialboxed').materialbox();
            $('#formSubmit').click(() => { 
                let formData = getAllUserInput(); 
                let validUserInput = validateFormData(formData);
                if (validUserInput) {
                    addOrUpdatePart(formData, cardID)
                }
            });
            $('#clickMeButton').click(() => { 
                resetFormInput();
            });
            $('#searchSubmit').click(() => { 
                createFilterButtonsBasedOnSearchInput(ALL_PARTS_ARRAY);
                updateDisplayBasedOnFilters(ALL_PARTS_ARRAY);
            });
            $('.modal').modal();
        });

    } catch (error) {
        console.error(error);
    }
};

// CHECK WHETHER MODULE OBJECT IS DEFINED
// << (Node.js environment) >>
// ---------------------------
if (typeof module !== 'undefined') { module.exports = { countValidParts, countValidParts, addCards }; } // EXPORTS
// << (browser environment) >>
// ---------------------------
else { 
    initialiseDOM(); 
} // INITIALISE DOM
//The above conditional allows the same code to be used in both environments.