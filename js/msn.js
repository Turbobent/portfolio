// Change the username
function changeUsername() {
    const newUsername = prompt('skriv dit navn:');
    if (newUsername) {
        const usernameDisplay = document.querySelector('.chat-header p:first-child');
        usernameDisplay.textContent = `Username: ${newUsername}`;
    }
}