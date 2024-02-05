const REGO = localStorage.getItem("reg");

// Append a table of parts installed to the aircraft
$('#aircraftInventoryTable thead').append(`
    <h2 style='color:DodgerBlue'>${REGO}</h2>
`);

$.get(`${SERVER_URL}/ops/getAircraft/${REGO}`)
.then(response => {
    parts = response.aircraft.parts;
    console.log(parts);
    for(let key in parts){
        console.log(key + ": " + parts[key].partName);
        $('#aircraftInventoryTable tbody').append(`
            <tr>
                <td>
                    ${parts[key].partName}
                </td>
                <td>
                    SN: ${parts[key]._id}
                </td>
            </tr>
        `);
    };
});

async function installPart(){
    // Get the available parts from the inventory (spares inventory)
    const candidatePart = $('#partNumberForInstall').val();
    const availableParts = await getAllParts(); // from inventoryScript.js
    console.log(availableParts);
    let validStock = false;
    let verifiedPart = null;
    availableParts.forEach(part => {
        if(candidatePart == part.partName){
            validStock = true;
            verifiedPart = part;
        }
    });
    if(validStock){ // remove from the spares inventory & add to the aircraft inventory
        // DELETE FROM SPARES INVENTORY
        let url = SERVER_URL + '/api/part/' + verifiedPart._id;
        deleteThis(url); // from index.js
        // ADD TO AIRCRAFT INVENTORY
        const body = {verifiedPart, rego:REGO};
        url = SERVER_URL + '/ops/installPart';
        $.ajax({
            url: `${url}`,
            type: 'POST',
            data: JSON.stringify(body),
            contentType: "application/json; charset=utf-8",
            traditional: true,
            success: function(response) {
                localStorage.setItem('last post log', JSON.stringify(response));
                location.reload();
            },
            error: function(response) {
                localStorage.setItem('last post log', JSON.stringify(response));
                location.reload();
            }
        });
    }
}