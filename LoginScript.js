const submit = document.getElementById("submit");
const username = document.getElementById("username");
const password = document.getElementById("password");
const register = document.getElementById("register");

register.onclick = function() {window.location.href = 'WhisperEmbPages/Register/Register.html';}
submit.onclick = function() {
    const usernameValue = username.value;
    const passwordValue = password.value;

    if (usernameValue == '' || passwordValue == '') {return;}

    submit.innerHTML = 'Signing in...';
    fetch('https://whisper-login-server.vercel.app/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({usernameValue, passwordValue})
    })
        .then(response => response.json())
    .then(data => {
        if (data.success) {
            submit.innerHTML = 'Sign in';
            userData = data.userData;
            localStorage.setItem('userData', JSON.stringify(userData));
            window.location.href = 'WhisperEmbPages/Home/Home.html';
        }
        else {
            submit.innerHTML = 'Sign in';
            AccessDenial(data.error);
        }
    })
    .catch(error => {
        submit.innerHTML = 'Sign in';
        alert("Oops! An error has been occured.");
        console.log(error);
    });
}

function AccessDenial(message) {
    accessDenial.innerHTML = message;
    submit.style.visibility = "hidden";
    accessDenial.style.visibility = "visible";
    accessDenial.style.opacity = 1;
    accessDenial.style.top = "-40px";
    setTimeout(() => {
        submit.style.visibility = "visible";
        accessDenial.style.visibility = "hidden";
        accessDenial.style.opacity = 0;
        accessDenial.style.top = "0px";
    }, 3000);
}
