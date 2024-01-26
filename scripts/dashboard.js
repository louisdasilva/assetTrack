function inventoryPage() {
	const session = getSession();
	location.href = SERVER_URL + '/inventory?sk=' + session; // request page at server endpoint that matches INPUT SERVER ENDPOINT HERE!
}