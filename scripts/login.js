const SERVER_URL = 'http://localhost:3000/';

function login() {
    
    const userName = $('#userName').val();
    if(userName == "") {
        alert("Error! \n Please enter a username.");
        location.href=SERVER_URL;
        return
    }
    const userPassword = $('#userPassword').val();
    if(userPassword == "") {
        alert("Error! \n Please enter a password.");
        location.href=SERVER_URL;
        return
    }
    
    url = SERVER_URL + 'userValidate/' + userName;
    
    $.get(url)
    .then(response => {
        if(userName === response.data.username) {
            if(userPassword === response.data.password) {
                alert("SUCCESS, NOW MAKE A PAGE TO NAVIGATE TO!");
                location.href=SERVER_URL; // THEN NAVIGATE TO IT!
            } else {
                alert("Error! \n That password does not match the username.");
                location.href=SERVER_URL;
            } 
        } else {
            alert("Error! \n Username not found, please contact admin.");
            location.href=SERVER_URL;
        }          
    });
}