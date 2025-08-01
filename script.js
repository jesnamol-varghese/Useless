const text = document.getElementById("text");
const popup = document.getElementById("popup");
const closeBtn = document.getElementById("closeBtn");
const video = document.getElementById("rickroll");
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;
let dx = 6;
let dy = 4;

let textWidth, textHeight;
let userHasInteracted = false;
let animationStarted = false;

function updateTextDimensions() {
  const rect = text.getBoundingClientRect();
  textWidth = rect.width;
  textHeight = rect.height;
}

updateTextDimensions();
window.addEventListener('resize', updateTextDimensions);

// Handle "Click to Start"
startBtn.addEventListener("click", () => {
  userHasInteracted = true;
  startScreen.style.display = "none";
  if (!animationStarted) {
    animationStarted = true;
    resetFromCenter();
    animate();
  }
});

function getRandomChance() {
  return true; // Always show popup for testing
}

function resetFromCenter() {
  x = window.innerWidth / 2;
  y = window.innerHeight / 2;
  dx = (Math.random() < 0.5 ? -1 : 1) * 6;
  dy = (Math.random() < 0.5 ? -1 : 1) * 4;
}

function showPopup() {
  popup.style.display = "flex";
  video.currentTime = 0;

  if (userHasInteracted) {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn("Autoplay with audio failed:", err);
      });
    }
  } else {
    console.warn("User hasn't interacted — audio autoplay blocked.");
  }
}

function hidePopup() {
  popup.style.display = "none";
  video.pause();
  resetFromCenter();
}

closeBtn.addEventListener("click", hidePopup);

function animate() {
  if (popup.style.display === "flex") return;

  x += dx;
  y += dy;

  const maxX = window.innerWidth - textWidth;
  const maxY = window.innerHeight - textHeight;

  const nearLeft = x <= 0;
  const nearRight = x >= maxX;
  const nearTop = y <= 0;
  const nearBottom = y >= maxY;

  if ((nearLeft || nearRight) && (nearTop || nearBottom)) {
    if (getRandomChance()) {
      showPopup();
      return;
    } else {
      dx *= -1;
      dy *= -1;
    }
  } else {
    if (x <= 0 || x >= maxX) dx *= -1;
    if (y <= 0 || y >= maxY) dy *= -1;
  }

  text.style.left = `${x}px`;
  text.style.top = `${y}px`;

  requestAnimationFrame(animate);
}
