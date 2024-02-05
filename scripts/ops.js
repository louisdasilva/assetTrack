function addAircraft() {
    const rego = $('#newAircraftRego').val();
    const body = {rego};
    const session = getSession(); // from index.js
    postThis( // function in index.js
        `${SERVER_URL}/ops/addAircraft`, // SERVER_URL in index.js
        body,
        SERVER_URL + '/opsInventory?sk=' + session
    );
};

// Appends a table of aircraft in the fleet
$.get(`${SERVER_URL}/ops/fleet`)
.then(response => {
    response.fleet.forEach(aircraft => {
        $('#aircraftTable tbody').append(`
            <tr>
                <td>
                <br>
                    <button onclick=goToAircraft('${aircraft.registration}')>${aircraft.registration}</button>
                </td>
            </tr>`
        );
    });
});

function goToAircraft(rego){
    const session = getSession(); // from index.js
    localStorage.setItem("reg",rego); // store the aircraft registration in browser local storage
    location.href = SERVER_URL + '/aircraft?sk=' + session;
}