// Functions to open and close windows
function openLinksWindow() {
    document.getElementById("linksWindow").style.display = "block";
}

function closeLinksWindow() {
    document.getElementById("linksWindow").style.display = "none";
}

function openMineSweeperWindow() {
  document.getElementById('mineSweeperWindow').style.display = 'block';
  document.getElementById('kabaleWindow').style.display = 'none';
}

function openReposWindow() {
  document.getElementById("reposWindow").style.display = "block";
  fetchRepos();
}

function closeReposWindow() {
  document.getElementById("reposWindow").style.display = "none";
}

function openMailWindow() {
  document.getElementById("mailWindow").style.display = "block";
  fetchRepos();
}

function closeMailWindow() {
  document.getElementById("mailWindow").style.display = "none";
}
function closeMineSweeperWindow() {
    document.getElementById("mineSweeperWindow").style.display = "none";
}

function openKabaleWindow() {
  document.getElementById('kabaleWindow').style.display = 'block';
  document.getElementById('mineSweeperWindow').style.display = 'none';
}
function closeKabaleWindow() {
    document.getElementById("kabaleWindow").style.display = "none";
}

function openMailWindow() {
  document.getElementById('mailWindow').style.display = 'block';
}

function closeMailWindow() {
  document.getElementById('mailWindow').style.display = 'none';
}

function resetMailForm() {
  document.getElementById('mailForm').reset();
}

// Function to make a window draggable
function makeWindowDraggable(windowElement, handleElement) {
  let offsetX = 0, offsetY = 0, isDragging = false;

  if (!handleElement) {
      console.error("Handle element is null");
      return;
  }

  handleElement.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - windowElement.offsetLeft;
      offsetY = e.clientY - windowElement.offsetTop;
      document.addEventListener("mousemove", onMouseMove);
  });

  document.addEventListener("mouseup", () => {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
  });

  function onMouseMove(e) {
      if (!isDragging) return;
      windowElement.style.left = `${e.clientX - offsetX}px`;
      windowElement.style.top = `${e.clientY - offsetY}px`;
  }
}

// Initialize draggable functionality for both windows
makeWindowDraggable(document.getElementById("linksWindow"), document.getElementById("titleBar"));
makeWindowDraggable(document.getElementById("mineSweeperWindow"), document.getElementById("#mineSweeperWindow .top-wrapper"));
makeWindowDraggable(document.getElementById("kabaleWindow"), document.getElementById("#kabaleWindow .top"));
 


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
