const SERVER_URL = 'http://localhost:3000/';

function validateInput() {
    //VALIDATE USERNAME
    const userName = $('#userName').val();
    let nameInputFeedbackText = document.getElementById("nameInputFeedbackText");
    if(userName == "") {
        nameInputFeedbackText.className = "col-md-4 text-danger d-flex align-items-center form-text";
        nameInputFeedbackText.innerHTML = "You did not enter your Username.";
    }
    else { 
        nameInputFeedbackText.className = "col-md-4 text-success d-flex align-items-center form-text";
        nameInputFeedbackText.innerHTML = "Valid";
    }
    //VALIDATE PASSWORD
    const userPassword = $('#userPassword').val();
    let passwordInputFeedbackText = document.getElementById("passwordInputFeedbackText");
    if(userPassword == "") {
        passwordInputFeedbackText.className = "col-md-4 text-danger d-flex align-items-center form-text";
        passwordInputFeedbackText.innerHTML = "You did not enter your Password.";
    }
    else { 
        passwordInputFeedbackText.className = "col-md-4 text-success d-flex align-items-center form-text";
        passwordInputFeedbackText.innerHTML = "Valid";
    }
    //CALL CheckCredentials METHOD
    if (passwordInputFeedbackText.innerHTML == "Valid" && nameInputFeedbackText.innerHTML == "Valid") {
        CheckCredentials(userName, userPassword); 
    }
}

function CheckCredentials(userName, userPassword) {

    let url = SERVER_URL + 'userValidate/' + userName;
    
    $.get(url) //Here userName is used to GET the matching object with the same userName from the database.
        .then(response => {
            if (response.data == undefined) { //First we must check if a matching object was found.
                alert("Error! \n Username not found, please contact admin.");
                location.href=SERVER_URL;
            }
            //NOW CHECK PASSWORD - Note checking for username is redundant as we already navigated to object with userName.
            else if (userPassword === response.data.password) {
                location.href = SERVER_URL + 'parts.html';
            }
            else {
                alert("Error! \n That password does not match the username.");
                location.href=SERVER_URL;
            }
        });
}