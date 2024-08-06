const submit = document.getElementById("submit");
const username = document.getElementById("username");
const password = document.getElementById("password");
const register = document.getElementById("register");

submit.innerHTML = 'Signing in...';
submit.onclick = function() {
    const usernameValue = username.value;
    const passwordValue = password.value;

    if (usernameValue == '' || passwordValue == '') {return;}

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
            alert(data.error);
        }
    })
    .catch(error => {
        submit.innerHTML = 'Sign in';
        alert("Oops! An error has been occured.");
        console.log(error);
    });
}

register.onclick = function() {window.location.href = 'https://darttgoblin.github.io/Whisper/WhisperEmbPages/Register/Register.html';}
