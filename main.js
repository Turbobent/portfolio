// Functions to open and close windows
function openLinksWindow() {
    document.getElementById("linksWindow").style.display = "block";
}

function closeLinksWindow() {
    document.getElementById("linksWindow").style.display = "none";
}

// main.js or a separate file with common functions

function openMineSweeperWindow() {
  document.getElementById('mineSweeperWindow').style.display = 'block';
  document.getElementById('kabaleWindow').style.display = 'none';
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
makeWindowDraggable(document.getElementById("mineSweeperWindow"), document.getElementById("#mineSweeperWindow .top"));
makeWindowDraggable(document.getElementById("kabaleWindow"), document.getElementById("#kabaleWindow .top"));
// script.js
 
