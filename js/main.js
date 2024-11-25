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

function openResumeWindow() {
  document.getElementById('resumeWindow').style.display = 'block';
}

function closeResumeWindow() {
  document.getElementById('resumeWindow').style.display = 'none';
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
function openAboutWindow() {
  document.getElementById('aboutWindow').style.display = 'block';
}

function closeAboutWindow() {
  document.getElementById('aboutWindow').style.display = 'none';
}

function openTab(event, tabName) {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  // Remove active class from all buttons and content
  tabButtons.forEach(button => button.classList.remove('active'));
  tabContents.forEach(content => content.classList.remove('active'));

  // Add active class to the clicked button and corresponding content
  event.currentTarget.classList.add('active');
  document.getElementById(tabName).classList.add('active');
}

function openMsnWindow() {
  document.getElementById('msnWindow').style.display = 'block';
}

function closeMsnWindow() {
  document.getElementById('msnWindow').style.display = 'none';
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
