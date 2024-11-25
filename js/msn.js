// Change the username
function changeUsername() {
    const newUsername = prompt('Enter a new username:');
    if (newUsername) {
        const usernameDisplay = document.querySelector('.chat-header p:first-child');
        usernameDisplay.textContent = `Username: ${newUsername}`;
    }
}