const inputs = document.getElementsByClassName("inputs");
const select = document.getElementsByTagName("select")[0];
const register = document.getElementById("register");
const haveacc = document.getElementById("haveacc");

haveacc.onclick = function() {window.location.href = '../../Login.html';}
register.onclick = function() {
    for (var i = 0; i < inputs.length; i++) {if (inputs[i].value == '') {DisplayError(inputs[i].id); return;}}
    if (inputs[3].value != inputs[4].value) {DisplayError('notmatched'); return;}
    if (select.value == 'Choose Gender') {DisplayError('gender'); return;}

    const userData = {
        name: inputs[0].value,
        email: inputs[1].value,
        username: inputs[2].value,
        password: inputs[3].value,
        gender: select.value
    }

    register.innerHTML = 'Registring...';
    fetch('https://whisper-register-server.vercel.app/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userData})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration has been successful!');
            window.location.href = 'https://darttgoblin.github.io/Whisper/Login.html';
            register.innerHTML = 'Register';
        }
        else {
            alert(data.error);
            console.log(data.error);
            register.innerHTML = 'Register';
        }
    })
    .catch(error => {
        alert('An error has been occured, please try later!');
        console.log(error);
        register.innerHTML = 'Register';
    });
}

function DisplayError(error) {
    if (error == 'name') {alert('Name is required');}
    else if (error == 'email') {alert('Email is required');}
    else if (error == 'username') {alert('username is required');}
    else if (error == 'password') {alert('password is required!');}
    else if (error == 'cpassword') {alert('password confirmation is required!');}
    else if (error == 'gender') {alert('Gender is required!');}
    else if (error == 'notmatched') {alert('Passwords are not matched!');}
}
