const signout = document.getElementById('signout');
const respSignout = document.getElementById('respSignout');

signout.onclick = respSignout.onclick = function() {
    localStorage.removeItem('userData');
    window.location.href = '../../Login.html';
}
