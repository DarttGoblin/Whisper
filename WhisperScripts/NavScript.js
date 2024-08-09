const navLinks = document.getElementsByClassName('navLinks');
const respNavLinks = document.getElementsByClassName('respNavLinks');
const setDiv = document.getElementById('setDiv');
const navCont = document.getElementById('navCont');
const darkBgNavDiv = document.getElementById('darkBgNavDiv');

const pages = [
    '../Home/Home.html',
    '../Profile/Profile.html',
    '../Group/Group.html',
    '../Private/Private.html',
    '../Settings/Settings.html'
];

ListenToWindowWidth();

setDiv.onclick = function() {ResponseNavState('open');}
darkBgNavDiv.onclick = function() {ResponseNavState('close');}

for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].onclick = respNavLinks[i].onclick = function() {
        if (i == 1 || i == 3 || i == 4) {alert('This service is not available yet. Check later!'); return;}
        window.location.href = pages[i];
    }
}

function ResponseNavState(state) {
    if (state == 'open') {
        darkBgNavDiv.style.display = 'block';
        navCont.style.width = 'min(400px, 80%)';
    }
    else {
        darkBgNavDiv.style.display = 'none';
        navCont.style.width = '0px';
    }
}
function ListenToWindowWidth() {
    window.onresize = function() {
        if (window.innerWidth > 1400) {
            darkBgNavDiv.style.display = 'none';
            navCont.style.width = '0px';
        }
    }
}
