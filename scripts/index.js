const SERVER_URL = 'http://localhost:3000'; 

function getSession() {
	// https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
	session = localStorage.getItem("sK");
	return session;
}