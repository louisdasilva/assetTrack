function addAircraft() {
    const rego = $('#newAircraftRego').val();
    const body = {rego};
    const session = getSession(); // from index.js
    postThis( // function in index.js
        `${SERVER_URL}/ops/addAircraft`,
        body,
        SERVER_URL + '/opsInventory?sk=' + session
    );
};