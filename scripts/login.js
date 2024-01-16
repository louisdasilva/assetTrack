const SERVER_URL = 'http://localhost:3000/';

function checkForInvalidCharacters(userInput) {
    // DEFINITIONS
    const ALPHABET = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
    'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    const NUMBERS = ['0','1','2','3','4','5','6','7','8','9'];
    const SYMBOLS = ['!', '@', '#', '$', '%', '^', '&', '*', '_'];
    const VALID_CHARACTERS = ALPHABET.concat(NUMBERS, SYMBOLS);
    let match = false;
    let invalidCharacter = false;
    // ITERATE THROUGH EACH CHARACTER AND COMPARE WITH VALID CHARACTERS
    userInput.split('').forEach(inputCharacter => {  
        match = false;  
        VALID_CHARACTERS.forEach(testCharacter => {
            if(inputCharacter == testCharacter) { match = true; }
        });
        if(!match) { 
            invalidCharacter = true; 
        }  
    });
    return invalidCharacter;
}

function validateInput() {
    let formatPositive = "col-md-4 text-success d-flex align-items-center form-text";
    let formatNegative = "col-md-4 text-danger d-flex align-items-center form-text";

    // VALIDATE USERNAME
    const userName = $('#userName').val();
    let nameInputFeedbackText = document.getElementById("nameInputFeedbackText");
    if(userName == "") {
        nameInputFeedbackText.className = formatNegative;
        nameInputFeedbackText.innerHTML = "You did not enter a Username.";
    }
    else if (checkForInvalidCharacters(userName)) {
        nameInputFeedbackText.className = formatNegative;
        nameInputFeedbackText.innerHTML = "Username includes invalid character";
    }
    else { 
        nameInputFeedbackText.className = formatPositive;
        nameInputFeedbackText.innerHTML = "Valid";
    }

    // VALIDATE PASSWORD SECTION
    const userPassword = $('#userPassword').val();
    let passwordInputFeedbackText = document.getElementById("passwordInputFeedbackText");

    // VALIDATE PASSWORD CONDITIONS
    if(userPassword == "") {
        passwordInputFeedbackText.className = formatNegative;
        passwordInputFeedbackText.innerHTML = "You did not enter a Password.";
    }
    else if (userPassword.length < 8) {
        passwordInputFeedbackText.className = formatNegative;
        passwordInputFeedbackText.innerHTML = "Password must be greater than 7 characters.";
    }
    else if (checkForInvalidCharacters(userPassword)) {
        passwordInputFeedbackText.className = formatNegative;
        passwordInputFeedbackText.innerHTML = "Invalid character in Password";
    }
    else { 
        passwordInputFeedbackText.className = formatPositive;
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