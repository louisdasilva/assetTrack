const SERVER_URL = 'http://localhost:3000'; 

function getSession() {
	// https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
	session = localStorage.getItem("sK");
	return session;
}

function cataloguePage() {
	const session = getSession();
	location.href = SERVER_URL + '/catalogue?sk=' + session; // request page at server endpoint that matches INPUT SERVER ENDPOINT HERE!
}

function dashboardPage() {
	const session = getSession();
	location.href = SERVER_URL + '/dash?sk=' + session; // request page at server endpoint that matches INPUT SERVER ENDPOINT HERE!
}

function inventoryPage() {
	const session = getSession();
	location.href = SERVER_URL + '/inventory?sk=' + session; // request page at server endpoint that matches INPUT SERVER ENDPOINT HERE!
}