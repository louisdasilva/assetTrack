const SERVER_URL = 'http://localhost:3000';

function getSession() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
    session = localStorage.getItem("sK");
    return session;
}

function cataloguePage() {
    const session = getSession();
    location.href = SERVER_URL + '/catalogue?sk=' + session;
    // location.href = SERVER_URL + '/catalogue';
}

function dashboardPage() {
    const session = getSession();
    location.href = SERVER_URL + '/dash?sk=' + session;
}

function inventoryPage() {
    const session = getSession();
    location.href = SERVER_URL + '/inventory?sk=' + session;
}

function opsInventoryPage() {
    const session = getSession();
    location.href = SERVER_URL + '/opsInventory?sk=' + session;
}

function postThis(url,body,navigateTo){
    $.ajax({
        url: `${url}`,
        type: 'POST',
        data: JSON.stringify(body),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function(response) {
            localStorage.setItem('log', JSON.stringify(response));
            location.href = `${navigateTo}`;
        },
        error: function(response) {
            localStorage.setItem('log', JSON.stringify(response));
            location.href = `${navigateTo}`;
        }
    });
}

function deleteThis(url){
    $.ajax({
        url: `${url}`,
        type: 'DELETE',
        traditional: true,
        success: function(response) {
            localStorage.setItem('last delete log', JSON.stringify(response));
        },
        error: function(response) {
            localStorage.setItem('last delete log', JSON.stringify(response));
        }
    });
}

// Append a nav-bar based on which page is the currently viewed page
const page = document.title;

if(page != "assetTrack - Dashboard"){
	$('#pageNavbar').append('<li><a href="#" class="me-1 dataButton navBar dataButton" id="navButton_to_dashboard" onclick="dashboardPage()">Home</a></li>');
}
if(page != 'assetTrack - Catalogue'){
	$('#pageNavbar').append('<li><a class="me-1 dataButton navBar dataButton" id="navButton_to_catalogue" onclick="cataloguePage()">Parts Catalogue</a></li>');
}
if(page != 'assetTrack - Inventory'){
	$('#pageNavbar').append('<li><a class="me-1 dataButton navBar dataButton" id="navButton_to_inventory" onclick="inventoryPage()">Inventory</a></li>');
}
if(page != 'assetTrack - opsInventory'){
	$('#pageNavbar').append('<li><a class="me-1 dataButton navBar dataButton" id="navButton_to_opsInventory" onclick="opsInventoryPage()">Operational Inventory</a></li>');
}

// Appends a Footer to every webpage
$('.footer').append("Copyright: AssetTrack 2024");