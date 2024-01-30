function buttonClicked() {
	// https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
	session = localStorage.getItem("sK");
	alert(
		"BUTTON WAS CLICKED!\n" +
		"Session key = " + session + "\n" +
		"Now attempting to navigate to undefined location, server will default to login page!"
	);
	location.href = SERVER_URL + '/<INPUT SERVER ENDPOINT HERE!>?sk=' + session; // request page at server endpoint that matches INPUT SERVER ENDPOINT HERE!
}