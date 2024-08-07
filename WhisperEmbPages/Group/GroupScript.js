const convDiv = document.getElementById('convDiv');
const convBody= document.getElementById('convBody');
const input = document.getElementById('input');
const send = document.getElementById('send');
const emojisCont = document.getElementById('emojisCont');
const emojisBtn = document.getElementById('emojisBtn');

const loadingCont = document.createElement('div');
const loadingIconCont = document.createElement('div');
const loadingIcon = document.createElement('i');
const loadingSpan = document.createElement('span');

var userData = JSON.parse(localStorage.getItem('userData'));
if (!userData) {window.location.href = '../../Login.html';} 

const socket = io('https://lovely-scented-wrench.glitch.me', {
    transports: ['websocket'],
    upgrade: false
});

LoadingConversation();
// ChangeBackground(userData.gender);

for (let i = 0; i < emojis.length; i++) {
    const emoji = document.createElement('span');
    emoji.classList.add('emoji');
    emoji.innerHTML = emojis[i];
    emojisCont.appendChild(emoji);
    emoji.onclick = function() {input.value += emoji.innerHTML;}
}

emojisBtn.onclick = function() {emojisCont.style.display = 'block';}
convBody.onclick = function() {emojisCont.style.display = 'none';}
input.onclick = function() {emojisCont.style.display = 'none';}
input.onkeydown = function(event) {if (event.key == 'Enter') {Send();}}
send.onclick = Send;

function GetCurrentTimestamp() {
    const currentDate = new Date();
    
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
function Send() {
    const messageObj = {
        message: input.value,
        sender: userData.name,
        timestamp: GetCurrentTimestamp()
    };
    if (messageObj.message == '') {return;}
    emojisCont.style.display = 'none';
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

function FetchOldMessage(user) {
    fetch('https://whisper-history-server.vercel.app/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadingCont.style.display = 'none';
            messages = data.messages;
            messages.forEach(message => {
                if (message.messageContent == 'join') {CreateJoinMessage(message.messageSender, 'connected');}
                else if (message.messageContent == 'left') {CreateJoinMessage(message.messageSender, 'disconnected');}
                else if (message.messageSender == userData.name) {CreateUserMessage(message.messageContent, message.messageTimestamp);}
                else {CreateOthersMessage(message.messageContent, message.messageSender, message.messageTimestamp);}
            });
            CreateJoinMessage(userData.name, 'connected');
            SaveJoinMessage(userData.name, 'join');
        }
        else {
            loadingSpan.innerHTML = 'Error loading conversation';
            CreateJoinMessage(user, 'connected');
            SaveJoinMessage(user, 'join');
            console.log("Error has been occured: " + data.error);
            setTimeout(() => {loadingCont.style.display = 'none';}, 2000);
        }
    })
    .catch(error => {
        loadingSpan.innerHTML = 'Error loading conversation';
        console.error("Error fetching old messages: " + error);
        CreateJoinMessage(user, 'connected');
        SaveJoinMessage(user, 'join');
        setTimeout(() => {loadingCont.style.display = 'none';}, 2000);
    });
}
function LoadingConversation() {
    loadingIconCont.classList.add('loadingIconCont');
    loadingCont.classList.add('loadingCont');
    loadingIcon.classList.add('fa');
    loadingIcon.classList.add('fa-gear');
    loadingIcon.classList.add('gear');
    loadingIcon.classList.add('rotateAnimation');
    loadingSpan.innerHTML = 'Loading conversation...';
    loadingSpan.classList.add('loadingSpan');

    loadingIconCont.appendChild(loadingIcon);
    loadingCont.appendChild(loadingIconCont);
    loadingCont.appendChild(loadingSpan);
    convBody.appendChild(loadingCont);
}
function CreateUserMessage(messageContent, messageTimestamp) {
    const currentDate = new Date();
    const messageDate = new Date(messageTimestamp);
    
    let displayTimestamp;
    if (currentDate.getFullYear() === messageDate.getFullYear() &&
        currentDate.getMonth() === messageDate.getMonth() &&
        currentDate.getDate() === messageDate.getDate()) {
        displayTimestamp = `${String(messageDate.getHours()).padStart(2, '0')}:${String(messageDate.getMinutes()).padStart(2, '0')}`;
    }
    else {displayTimestamp = `${messageDate.getFullYear()}-${String(messageDate.getMonth() + 1).padStart(2, '0')}-${String(messageDate.getDate()).padStart(2, '0')} ${String(messageDate.getHours()).padStart(2, '0')}:${String(messageDate.getMinutes()).padStart(2, '0')}`;}
    
    const message = document.createElement('span');
    const timestamp = document.createElement('span');
    message.innerHTML = messageContent;
    timestamp.innerHTML = displayTimestamp;
    message.classList.add('userMessage');
    timestamp.classList.add('userTiming');
    convBody.appendChild(message);
    convBody.appendChild(timestamp);
    convBody.scrollTop = convBody.scrollHeight;
    input.value = '';
}
function CreateOthersMessage(messageContent, messageSender, messageTimestamp) {
    const currentDate = new Date();
    const messageDate = new Date(messageTimestamp);
    
    let displayTimestamp;
    if (currentDate.getFullYear() === messageDate.getFullYear() &&
        currentDate.getMonth() === messageDate.getMonth() &&
        currentDate.getDate() === messageDate.getDate()) {
        displayTimestamp = `${String(messageDate.getHours()).padStart(2, '0')}:${String(messageDate.getMinutes()).padStart(2, '0')}`;
    } else {
        displayTimestamp = `${messageDate.getFullYear()}-${String(messageDate.getMonth() + 1).padStart(2, '0')}-${String(messageDate.getDate()).padStart(2, '0')} ${String(messageDate.getHours()).padStart(2, '0')}:${String(messageDate.getMinutes()).padStart(2, '0')}`;
    }
    
    const sender = document.createElement('span');
    const message = document.createElement('span');
    const timestamp = document.createElement('span');
    sender.innerHTML = messageSender;
    message.innerHTML = messageContent;
    timestamp.innerHTML = displayTimestamp;
    sender.classList.add('others');
    message.classList.add('othersMessage');
    timestamp.classList.add('othersTiming');
    convBody.appendChild(sender);
    convBody.appendChild(message);
    convBody.appendChild(timestamp);
    convBody.scrollTop = convBody.scrollHeight;
}
function CreateJoinMessage(user, state) {
    const join = document.createElement('span');
    const userSpan = document.createElement('span');
    userSpan.classList.add('userSpan');
    userSpan.innerHTML = user;
    if (state == 'connected') {join.innerHTML = 'has joined the chat';}
    else if (state == 'disconnected') {join.innerHTML = 'has left the chat';}
    join.classList.add('join');
    join.insertBefore(userSpan, join.firstChild);
    convBody.appendChild(join);
    convBody.scrollTop = convBody.scrollHeight;
}
function SaveJoinMessage(username, state) {
    const messageObj = {
        message: state,
        sender: username,
        timestamp: GetCurrentTimestamp()
    };
    fetch('https://whisper-savechat-server.vercel.app/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({messageObj})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {console.log(state + ' message saved!');}
        else {console.log(state + ' message not saved!');}
    })
    .catch(error => {console.log(error);});
}
function ChangeBackground(gender) {
    if (gender == 'male') {document.body.style.backgroundImage = maleBackgrounds[Math.floor(Math.random() * maleBackgrounds.length)];}
    else {document.body.style.backgroundImage = femaleBackgrounds[Math.floor(Math.random() * femaleBackgrounds.length)];}
}

socket.emit('user-connected', userData.name);
socket.on('recieve-chat-message', messageObj => {CreateOthersMessage(messageObj.message, messageObj.sender, messageObj.timestamp);});
socket.on('recieve-user-connected', user => {FetchOldMessage(user);});
socket.on('recieve-user-disconnected', user => {CreateJoinMessage(user, 'disconnected'); SaveJoinMessage(user, 'left');});
