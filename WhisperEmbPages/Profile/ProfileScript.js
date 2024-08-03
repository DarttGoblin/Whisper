const convDiv = document.getElementById('convDiv');
const convBody= document.getElementById('convBody');
const input = document.getElementById('input');
const send = document.getElementById('send');
const usernameSpan = document.getElementById('usernameSpan');
const logout = document.getElementById('logout');

// CreateMessage('Joined', userData.name + ':');
var userData = JSON.parse(localStorage.getItem('userData'));

if (userData) {usernameSpan.textContent = userData.name; } 
else {window.location.href = '../../Login.html';}

FetchOldMessage();

logout.onclick = function() {
    localStorage.clear();
    window.location.href = '../../Login.html';
}
send.onclick = function() {
    const messageObj = {
        message: input.value,
        sender: userData.name
    };
    if (messageObj.message == '') {return;}
    CreateMessage(messageObj.message, 'You' + ':');
    socket.emit('send-chat-message', messageObj);
    fetch('http://localhost:7001', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({messageObj})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {console.log('message saved!');}
        else {console.log('message not saved!');}
    })
    .catch(error => {console.log(error);});
}
function CreateMessage(messageContent, messageSender) {
    const sender = document.createElement('span');
    const message = document.createElement('span');
    const breakLineOne = document.createElement('br');
    const breakLineTwo = document.createElement('br');
    const breakLineThree = document.createElement('br');
    sender.textContent = messageSender;
    message.textContent = messageContent;
    convBody.appendChild(sender);
    convBody.appendChild(breakLineOne);
    convBody.appendChild(message);
    convBody.appendChild(breakLineTwo);
    convBody.appendChild(breakLineThree);
    convBody.scrollTop = convBody.scrollHeight;
    input.value = '';
}
function FetchOldMessage() {
    fetch('http://localhost:7000', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messages = data.messages;
            messages.forEach(message => {
                if (message.messageSender == userData.name) {CreateMessage(message.messageContent, 'You');}
                else {CreateMessage(message.messageContent, message.messageSender);}
            });
        }
        else {console.log("Error has been occured: " + data.error);}
    })
    .catch(error => {console.log("Error has been occured: " + error)});
}
// function ChangeBackgroud(gender) {
//     if (gender == 'male') {Math.floor(Math.random() * arrayLengeth);}
//     else {Math.floor(Math.random() * arrayLengeth);}
// }

const socket = io('http://localhost:3000');
socket.on('recieve-chat-message', messageObj => {CreateMessage(messageObj.message, messageObj.sender + ':');});