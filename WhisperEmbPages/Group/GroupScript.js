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

const userData = {name: 'yassine'}
// var userData = JSON.parse(localStorage.getItem('userData'));
// if (!userData) {window.location.href = '../../Login.html';} 


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

socket.emit('user-connected', userData.name);
socket.on('recieve-chat-message', messageObj => {CreateOthersMessage(messageObj.message, messageObj.sender, messageObj.timestamp);});
socket.on('recieve-user-connected', user => {FetchOldMessage(user);});
socket.on('recieve-user-disconnected', user => {CreateJoinMessage(user, 'disconnected'); SaveJoinMessage(user, 'left');});
