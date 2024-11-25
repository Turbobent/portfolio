function sendMail() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
  
    if (name && email && message) {
        alert(`Message sent!\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
        closeMailWindow();
    } else {
        alert('Please fill in all fields.');
    }
  }