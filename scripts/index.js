const SERVER_URL = 'http://localhost:3000';

function getSession() {
	// https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
	session = localStorage.getItem("sK");
	return session;
}

function cataloguePage() {
	const session = getSession();
	location.href = SERVER_URL + '/catalogue?sk=' + session;
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

// Append a nav-bar to every page based on which page is the currently viewed page
const page = document.title;
if(page != "assetTrack - Dashboard"){
	$('#pageNavbar').append('<button type="button" class="btn btn-primary me-1 dataButton" id="navButton_to_dashboard" onclick="dashboardPage()">Home</button>');
}
if(page != 'assetTrack - Catalogue'){
	$('#pageNavbar').append('<button type="button" class="btn btn-primary me-1 dataButton" id="navButton_to_catalogue" onclick="cataloguePage()">Parts Catalogue</button>');
}
if(page != 'assetTrack - Inventory'){
	$('#pageNavbar').append('<button type="button" class="btn btn-primary me-1 dataButton" id="navButton_to_inventory" onclick="inventoryPage()">Inventory</button>');
}

// Appends a Footer to every webpage
$('.footer').append("Copyright: AssetTrack 2024");