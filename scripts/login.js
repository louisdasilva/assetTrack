const SERVER_URL = 'http://localhost:3000/';
let loginFeedbackfield = document.getElementById("loginFeedback");    

function checkForInvalidCharacters(userInput) {
    // DEFINITIONS
    const ALPHABET = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
    'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    const NUMBERS = ['0','1','2','3','4','5','6','7','8','9'];
    const SYMBOLS = ['!', '@', '#', '$', '%', '^', '&', '*', '_'];
    const VALID_CHARACTERS = ALPHABET.concat(NUMBERS, SYMBOLS);
    let match = false;
    let isInvalidCharacter = false;
    // ITERATE THROUGH EACH CHARACTER AND COMPARE WITH VALID CHARACTERS
    userInput.split('').forEach(inputCharacter => {  
        match = false;  
        VALID_CHARACTERS.forEach(testCharacter => {
            if(inputCharacter == testCharacter) { match = true; }
        });
        if(!match) { 
            isInvalidCharacter = true; 
        }  
    });
    return isInvalidCharacter;
}

function validateInput() {
    let validUsername = false; 
    let validPassword = false;
    let formatNegative = "col-md-4 text-danger d-flex align-items-center form-text";

    // VALIDATE USERNAME
    const userName = $('#userName').val(); // Get Username User Input
    let nameInputFeedbackText = document.getElementById("nameInputFeedbackText");
    if(userName == "") {
        nameInputFeedbackText.className = formatNegative;
        nameInputFeedbackText.innerHTML = "You did not enter a Username.";
        loginFeedbackfield.innerHTML = "";
    }
    else if (checkForInvalidCharacters(userName)) {
        nameInputFeedbackText.className = formatNegative;
        nameInputFeedbackText.innerHTML = "Invalid character in Username";
        loginFeedbackfield.innerHTML = "";
    }
    // Note Username max length (16 chars) is set in index.html
    else { 
        validUsername = true;
        nameInputFeedbackText.innerHTML = "";
    }

    // VALIDATE PASSWORD SECTION
    const userPassword = $('#userPassword').val();  // Get Password User Input
    let passwordInputFeedbackText = document.getElementById("passwordInputFeedbackText");

    // VALIDATE PASSWORD CONDITIONS
    if(userPassword == "") {
        passwordInputFeedbackText.className = formatNegative;
        passwordInputFeedbackText.innerHTML = "You did not enter a Password.";
        loginFeedbackfield.innerHTML = "";
    }
    else if (userPassword.length < 8) { // Note max length (64 chars) is set in index.html
        passwordInputFeedbackText.className = formatNegative;
        passwordInputFeedbackText.innerHTML = "Password must be greater than 7 characters.";
        loginFeedbackfield.innerHTML = "";
    }
    else if (checkForInvalidCharacters(userPassword)) {
        passwordInputFeedbackText.className = formatNegative;
        passwordInputFeedbackText.innerHTML = "Invalid character in Password";
        loginFeedbackfield.innerHTML = "";
    }
    else { 
        validPassword = true;
        passwordInputFeedbackText.innerHTML = "";
    }
    //CALL CheckCredentials METHOD
    if (validUsername && validPassword) {
        CheckCredentials(userName, userPassword); 
    }
}

function CheckCredentials(userName, userPassword) {
    let url = SERVER_URL + 'userValidate/' + userName;
    let formatNegative = "text-danger text center form-text";

    
    $.get(url) //Here userName is used to GET the matching object with the same userName from the database.
        .then(response => {
            if (response.data == undefined) { //First we must check if a matching object was found.
                alert("Username not found, try \n Username: admin \n Password: assetTrack1! \nAlert to be removed.");
                loginFeedbackfield.className = formatNegative;
                // Provide feedback - but don't let user know if username is correct for security.
                loginFeedbackfield.innerHTML = "Username or Password does not match. If issue persists, please contact administrator for support.";
            }
            //NOW CHECK PASSWORD - Note checking for username is redundant as we already navigated to object with userName.
            else if (userPassword === response.data.password) {
                location.href = SERVER_URL + 'parts.html';
            }
            else {
                alert("Password does not match, try \n Username: admin \n Password: assetTrack1! \nAlert to be removed.");
                loginFeedbackfield.className = formatNegative;
                loginFeedbackfield.innerHTML = "Username or Password does not match. If issue persists, please contact administrator for support.";
            }
        });
}