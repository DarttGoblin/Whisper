const submit = document.getElementById("submit");
const username = document.getElementById("username");
const password = document.getElementById("password");
const register = document.getElementById("register");
const accessDenial = document.getElementById("accessDenial");
// https://whisper-login-server.vercel.app/
register.onclick = function() {window.location.href = 'https://darttgoblin.github.io/Whisper/WhisperEmbPages/Register/Register.html';}
submit.onclick = function() {
    console.log('clicked');
    const usernameValue = username.value;
    const passwordValue = password.value;

    if (usernameValue == '' || passwordValue == '') {return;}

    submit.innerHTML = 'Signing in...';
    fetch('http://localhost:7003', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({usernameValue, passwordValue})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('success')
            // submit.innerHTML = 'Sign in';
            // userData = data.userData;
            // localStorage.setItem('userData', JSON.stringify(userData));
            // window.location.href = 'https://darttgoblin.github.io/Whisper/WhisperEmbPages/Home/Home.html';
        }
        else {
            submit.innerHTML = 'Sign in';
            AccessDenial(data.error);
        }
    })
    .catch(error => {
        submit.innerHTML = 'Sign in';
        AccessDenial("Oops! An error occured.");
        console.log(error);
    });
}

function AccessDenial(message) {
    accessDenial.innerHTML = message;
    submit.style.visibility = "hidden";
    accessDenial.style.visibility = "visible";
    accessDenial.style.opacity = 1;
    accessDenial.style.top = "-30px";
    setTimeout(() => {
        submit.style.visibility = "visible";
        accessDenial.style.visibility = "hidden";
        accessDenial.style.opacity = 0;
        accessDenial.style.top = "10px";
    }, 3000);
}