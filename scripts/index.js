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

// Appends a Footer to every webpage
$('.footer').append("Copyright: AssetTrack 2024");