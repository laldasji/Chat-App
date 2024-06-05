const loginIdStatus = document.querySelector("#loginIdStatus");
const loginButton = document.querySelector("#register");
const usernameInput = document.querySelector("#inputUsername");

const usernameRules = document.createElement("div");
usernameRules.style.fontSize = '1.25rem';
usernameRules.style.backgroundColor = "var(--slate-gray)";
usernameRules.style.color = 'var(--baby-powder)';
usernameRules.style.boxShadow = '0.5rem 0.5rem 0 black';
usernameRules.style.padding = '1rem';
usernameRules.textContent = "Username must contain Alphanumeric characters; no spaces, special characters allowed";

const checkValidUsername = (userName) => {
    if (userName === '' || userName.length > 32)
        return false;
    for (let i = 0; i < userName.length; i++)
    {
        if (!(((userName[i] >= 'A' && userName[i] <= 'Z') || (userName[i] >= 'a' && userName[i] <= 'z')) || (userName[i] >= '0' && userName[i] <= '9')))
            return false;
    }
    console.log(userName + 'is valid');
    return true;
};

const performLogin = (userName) => {
    if (checkValidUsername(userName))
    {
        loginIdStatus.textContent = '';
        // verify from server
        
        // process server's response
        // case I: occupied
        
        // case II: invalid username

        // case III: Valid, username granted
        sessionStorage.setItem('userID', userName);
        window.location.href = 'chatInterface.html';
    }
    else
    {
        loginIdStatus.appendChild(usernameRules);
    }
};

loginButton.addEventListener('click', () => performLogin(usernameInput.value));

usernameInput.addEventListener("keydown", (event) => {
    if (event.which === 13) {
        event.preventDefault();
        performLogin(usernameInput.value);
    }
});

usernameInput.focus();