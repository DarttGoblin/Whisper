const inputs = document.getElementsByClassName("inputs");
const select = document.getElementsByTagName("select")[0];
const register = document.getElementById("register");
const haveacc = document.getElementById("haveacc");
const accessDenial = document.getElementById('accessDenial');

for (let i = 0; i < inputs.length; i++) {inputs[i].oninput = function() {inputs[i].value = inputs[i].value.charAt(0).toLowerCase() + inputs[i].value.slice(1);}}

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
            window.location.href = '../../Login.html';
            register.innerHTML = 'Register';
        }
        else {
            alert(data.error);
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
    if (error == 'name') {AccessDenial('Name is required');}
    else if (error == 'email') {AccessDenial('Email is required');}
    else if (error == 'username') {AccessDenial('username is required');}
    else if (error == 'password') {AccessDenial('password is required!');}
    else if (error == 'cpassword') {AccessDenial('password confirmation is required!');}
    else if (error == 'gender') {AccessDenial('Gender is required!');}
    else if (error == 'notmatched') {AccessDenial('Passwords are not matched!');}
}
function AccessDenial(message) {
    accessDenial.innerHTML = message;
    register.style.visibility = "hidden";
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
