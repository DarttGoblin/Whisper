const signout = document.getElementById('signout');
const respSignout = document.getElementById('respSignout');

signout.onclick = respSignout.onclick = function() {
    localStorage.clear();
    window.location.href = '../../Login.html';
}