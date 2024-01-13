
// ARRAY OF ALL VALID PART FAMILIES -> GLOABL SCOPE AS USED BY MULTIPLE METHODS
const validParts = [ "wing" , "fuselage" , "tail" , "engine" , "landing gear" , "cockpit" ];

// COUNT TOTAL NUMBER OF VALID PARTS PER PART FAMILY
function countValidParts(arr) {
    const partCount = {};

    arr.forEach((part) => {
        if (part != "") {
            let lowerCasePart;
            if (part != null && part != undefined) {
                lowerCasePart = part.toLowerCase(); //lowercase to match the static validParts array.
            }
    
            if (validParts.includes(lowerCasePart)) {
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
            if (validParts.includes(lowerCasePart)) {
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

// EXTRACT CLIENT FORM INPUT INFORMATION
const formSubmitted = () => {
    let formData = {};
    formData.partName = $('#partName').val();
    formData.partFamily = $('#partFamily').val();
    // formData.partNumber = $('#partNumber').val(); //TODO
    formData.path = $('#path').val();
    formData.description = $('#description').val();
    // CALL METHOD TO POST FORM DATA TO SERVER
    postPart(formData);
}

let searchInput = {};
// EXTRACT SEARCH INFO FROM INPUT INFORMATION
const searchSubmitted = () => {
    searchInput = $('#searchInput').val();
    console.log(searchInput);
    $('#searchModal').modal('close');
}

function checkSearch(allParts) {
    // console.log("Search Input Data: "+JSON.stringify(searchInput));
    // console.log("DB Response Data: "+JSON.stringify(allParts))
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
            alert('Part Post Successful');
            location.reload(true); // REFRESH PAGE
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

// << MAIN METHIOD >>
// ------------------
const initialiseDOM = async () => {
    try {
        const ALL_PARTS_ARRAY = await getAllParts(); // CREATE ARRAY OF ALL OBJECTS IN THE PARTS COLLECTION
        const ALL_COMPONENTS_ARRAY = ALL_PARTS_ARRAY.map(part => part.partFamily); // CREATE ARRAY OF ALL COMPONENTS IN THE PARTS COLLECTION E.G. { wing, fuselage, wing }
        const COMPONENT_COUNT = countValidParts(ALL_COMPONENTS_ARRAY); // CREATE OBJECT OF ALL COMPONENTS AND THEIR COUNT IN PARTS COLLECTION E.G. { wing: 2, fuselage: 3 }
        checkSearch(ALL_PARTS_ARRAY);
        populateTable(COMPONENT_COUNT, ""); // CREATE COMPONENT TABLE WITH COUNT OF DIFFERENT COMPONENTS
        addCards(ALL_PARTS_ARRAY); // CREATE A CARD FOR EACH PART
    } catch (error) {
        console.error(error);
    }
};

// << MAIN METHIOD >>
// ------------------
const initialiseDOMElements = async () => {
    // INITIALISE & EXECUTE FUNCTIONS WHEN PAGE HAS LOADED
    $(document).ready(function () {
        $('.materialboxed').materialbox();
        $('#formSubmit').click(() => { formSubmitted(); });
        $('#searchSubmit').click(() => { searchSubmitted(); });
        $('.modal').modal();
    });
};

// CHECK WHETHER MODULE OBJECT IS DEFINED
// << (Node.js environment) >>
// ---------------------------
if (typeof module !== 'undefined') { module.exports = { countValidParts, countValidParts, addCards }; } // EXPORTS
// << (browser environment) >>
// ---------------------------
else { 
    initialiseDOMElements();
    initialiseDOM(); 
} // INITIALISE DOM
//The above conditional allows the same code to be used in both environments.