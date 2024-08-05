const convDiv = document.getElementById('convDiv');
const convBody= document.getElementById('convBody');
const input = document.getElementById('input');
const send = document.getElementById('send');
const emojisCont = document.getElementById('emojisCont');
const emojisBtn = document.getElementById('emojisBtn');

const socket = io('https://lovely-scented-wrench.glitch.me', {
    transports: ['websocket'],
    upgrade: false
});

var userData = JSON.parse(localStorage.getItem('userData'));
if (!userData) {window.location.href = '../../Login.html';} 

for (let i = 0; i < emojis.length; i++) {
    const emoji = document.createElement('span');
    emoji.classList.add('emoji');
    emoji.innerHTML = emojis[i];
    emojisCont.appendChild(emoji);
    emoji.onclick = function() {input.value += emoji.innerHTML;}
}

// ChangeBackground(userData.gender);
FetchOldMessage();

emojisBtn.onclick = function() {emojisCont.style.display = 'block';}
convBody.onclick = function() {emojisCont.style.display = 'none';}
input.onclick = function() {emojisCont.style.display = 'none';}
input.onkeydown = function(event) {if (event.key == 'Enter') {Send();}}
send.onclick = Send;
    
function Send() {
    const messageObj = {
        message: input.value,
        sender: userData.name,
        timestamp: GetCurrentTimestamp()
    };
    if (messageObj.message == '') {return;}
    CreateUserMessage(messageObj.message, messageObj.timestamp);
    socket.emit('send-chat-message', messageObj);
    fetch('https://whisper-savechat-server.vercel.app/', {
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
function CreateUserMessage(messageContent, messageTimestamp) {
    const message = document.createElement('span');
    const timestamp = document.createElement('span');
    message.innerHTML = messageContent;
    timestamp.innerHTML = messageTimestamp;
    message.classList.add('userMessage');
    timestamp.classList.add('userTiming');
    convBody.appendChild(message);
    convBody.appendChild(timestamp);
    convBody.scrollTop = convBody.scrollHeight;
    input.value = '';
}
function CreateOthersMessage(messageContent, messageSender, messageTimestamp) {
    const sender = document.createElement('span');
    const message = document.createElement('span');
    const timestamp = document.createElement('span');
    sender.innerHTML = messageSender;
    message.innerHTML = messageContent;
    timestamp.innerHTML = messageTimestamp;
    sender.classList.add('others');
    message.classList.add('othersMessage');
    timestamp.classList.add('othersTiming');
    convBody.appendChild(sender);
    convBody.appendChild(message);
    convBody.appendChild(timestamp);
    convBody.scrollTop = convBody.scrollHeight;
    input.value = '';
}
function CreateJoinMessage(user, state) {
    const join = document.createElement('span');
    const userSpan = document.createElement('span');
    userSpan.classList.add('userSpan');
    userSpan.innerHTML = user;
    if (state == 'connected') {join.innerHTML = 'has joined the chat';}
    else {join.innerHTML = 'has left the chat';}
    join.classList.add('join');
    join.insertBefore(userSpan, join.firstChild);
    convBody.appendChild(join);
    convBody.scrollTop = convBody.scrollHeight;
}
function FetchOldMessage() {
    fetch('https://whisper-history-server.vercel.app/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messages = data.messages;
            messages.forEach(message => {
                if (message.messageSender == userData.name) {CreateUserMessage(message.messageContent, ConvertDateFormat(message.messageTimestamp));}
                else {CreateOthersMessage(message.messageContent, message.messageSender, ConvertDateFormat(message.messageTimestamp));}
            });
        }
        else {console.log("Error has been occured: " + data.error);}
    })
    .catch(error => {console.log("Error has been occured: " + error)});
}
function GetCurrentTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
function ConvertDateFormat(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// function ChangeBackground(gender) {
//     if (gender == 'male') {document.body.style.backgroundImage = maleBackgrounds[Math.floor(Math.random() * maleBackgrounds.length)];}
//     else {document.body.style.backgroundImage = femaleBackgrounds[Math.floor(Math.random() * femaleBackgrounds.length)];}
// }

socket.emit('user-connected', userData.name);
socket.on('recieve-chat-message', messageObj => {CreateOthersMessage(messageObj.message, messageObj.sender, messageObj.timestamp);});
socket.on('recieve-user-connected', user => {setTimeout(() => {CreateJoinMessage(user, 'connected');}, 500)});
socket.on('recieve-user-disconnected', user => {CreateJoinMessage(user, 'disconnected');});
