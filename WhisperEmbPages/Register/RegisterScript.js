const inputs = document.getElementsByClassName("inputs");
const select = document.getElementsByTagName("select")[0];
const register = document.getElementById("register");
const haveacc = document.getElementById("haveacc");
const accessDenial = document.getElementById('accessDenial');

for (let i = 0; i < inputs.length; i++) {inputs[i].oninput = function() {inputs[i].value = inputs[i].value.charAt(0).toLowerCase() + inputs[i].value.slice(1);}}
inputs[1].oninput = function() {
    if (inputs[1].value == '') {inputs[1].style.borderBottom = '2px solid white';}
    else if (isValidGmail(inputs[1].value)) {inputs[1].style.borderBottom = '2px solid green';} 
    else {inputs[1].style.borderBottom = '2px solid red';}
}
inputs[inputs.length - 1].oninput = function() {
    if (inputs[inputs.length - 1].value == inputs[inputs.length - 2].value) {inputs[inputs.length - 1].style.borderBottom = '2px solid green';} 
    else {inputs[inputs.length - 1].style.borderBottom = '2px solid red';}
}
inputs[inputs.length - 2].oninput = function() {inputs[inputs.length - 1].style.borderBottom = '2px solid white';}

haveacc.onclick = function() {window.location.href = '../../Login.html';}
register.onclick = function() {
    for (var i = 0; i < inputs.length; i++) {if (inputs[i].value == '') {DisplayError(inputs[i].id); return;}}
    if (inputs[3].value != inputs[4].value) {DisplayError('notmatched'); return;}
    if (select.value == 'Choose Gender') {DisplayError('gender'); return;}
    if (!isValidGmail(inputs[1].value)) {DisplayError('emailnotvalid'); return;}

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
    else if (error == 'emailnotvalid') {AccessDenial('Email is not valid');}
    else if (error == 'username') {AccessDenial('username is required');}
    else if (error == 'password') {AccessDenial('password is required!');}
    else if (error == 'cpassword') {AccessDenial('password confirmation<br>is required!');}
    else if (error == 'gender') {AccessDenial('Gender is required!');}
    else if (error == 'notmatched') {AccessDenial('Passwords are<br>not matched!');}
}
function AccessDenial(message) {
    accessDenial.innerHTML = message;
    register.style.visibility = "hidden";
    accessDenial.style.visibility = "visible";
    accessDenial.style.opacity = 1;
    accessDenial.style.top = "-30px";
    setTimeout(() => {
        register.style.visibility = "visible";
        accessDenial.style.visibility = "hidden";
        accessDenial.style.opacity = 0;
        accessDenial.style.top = "0px";
        accessDenial.innerHTML = 'Access Denied';
    }, 3000);
}
function isValidGmail(email) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
}
