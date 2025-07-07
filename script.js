const plane = document.getElementById("plane");
const game = document.getElementById("game");
const distanceDisplay = document.getElementById("distance");
const coinsDisplay = document.getElementById("coins");

let planeX = 50;
let planeY = window.innerHeight / 2;
let targetX = planeX;
let targetY = planeY;

let distance = 0;
let coins = 0;

let isInvincible = false;
let hasMagnet = false;
let speedMultiplier = 1;
let bonusShown = false;

const isMobile = window.innerWidth <= 768;

// --- Animation plane ---
function updatePlanePosition() {
  plane.style.left = planeX + "px";
  plane.style.top = planeY + "px";
}

function animatePlane() {
  planeX += (targetX - planeX) * 0.1;
  planeY += (targetY - planeY) * 0.1;
  updatePlanePosition();
  requestAnimationFrame(animatePlane);
}
animatePlane();

// --- Mobile : suivi du doigt ---
// Contrôles mobiles uniquement avec boutons
document.getElementById("btn-up").addEventListener("touchstart", () => {
  targetY = Math.max(0, targetY - 30);
});

document.getElementById("btn-down").addEventListener("touchstart", () => {
  targetY = Math.min(window.innerHeight - 40, targetY + 30);
});

document.getElementById("btn-right").addEventListener("touchstart", () => {
  targetX = Math.min(window.innerWidth - 60, targetX + 30);
});


// --- Ajout dans la boucle d'animation ---
function animatePlane() {
  planeX += (targetX - planeX) * 0.1;
  planeY += (targetY - planeY) * 0.1;
  updatePlanePosition();
  requestAnimationFrame(animatePlane);
}




// --- Nuages ---
function createCloud() {
  const cloud = document.createElement("div");
  cloud.classList.add("cloud");
  cloud.style.top = Math.random() * (window.innerHeight - 50) + "px";
  cloud.style.left = window.innerWidth + "px";
  game.appendChild(cloud);

  let cloudX = window.innerWidth;
  const move = setInterval(() => {
    cloudX -= 4;
    cloud.style.left = cloudX + "px";

    const planeRect = plane.getBoundingClientRect();
    const cloudRect = cloud.getBoundingClientRect();

    if (!isInvincible &&
      planeRect.left < cloudRect.right &&
      planeRect.right > cloudRect.left &&
      planeRect.top < cloudRect.bottom &&
      planeRect.bottom > cloudRect.top
    ) {
      alert("💥 Collision avec un nuage !\nDistance parcourue : " + distance + " m");
      location.reload();
    }

    if (cloudX < -100) {
      cloud.remove();
      clearInterval(move);
    }
  }, 16);
}

// --- Pièces ---
function createCoin() {
  const coin = document.createElement("div");
  coin.classList.add("coin");
  coin.style.top = Math.random() * (window.innerHeight - 30) + "px";
  coin.style.left = window.innerWidth + "px";
  game.appendChild(coin);

  let coinX = window.innerWidth;
  const move = setInterval(() => {
    coinX -= 4;
    coin.style.left = coinX + "px";

    const planeRect = plane.getBoundingClientRect();
    const coinRect = coin.getBoundingClientRect();

    if (
      planeRect.left < coinRect.right &&
      planeRect.right > coinRect.left &&
      planeRect.top < coinRect.bottom &&
      planeRect.bottom > coinRect.top
    ) {
      coin.remove();
      clearInterval(move);
      coins++;
      coinsDisplay.textContent = coins;
    }

    if (hasMagnet) {
      const planeCenterY = planeRect.top + planeRect.height / 2;
      const coinCenterY = coinRect.top + coinRect.height / 2;
      const deltaY = planeCenterY - coinCenterY;
      coin.style.top = parseFloat(coin.style.top) + deltaY * 0.05 + "px";
    }

    if (coinX < -50) {
      coin.remove();
      clearInterval(move);
    }
  }, 16);
}

// --- Bonus ---
function createBonus(type) {
  const bonus = document.createElement("div");
  bonus.classList.add("bonus", type);
  bonus.style.top = Math.random() * (window.innerHeight - 50) + "px";
  bonus.style.left = window.innerWidth + "px";
  game.appendChild(bonus);

  let bonusX = window.innerWidth;
  const move = setInterval(() => {
    bonusX -= 4;
    bonus.style.left = bonusX + "px";

    const planeRect = plane.getBoundingClientRect();
    const bonusRect = bonus.getBoundingClientRect();

    if (
      planeRect.left < bonusRect.right &&
      planeRect.right > bonusRect.left &&
      planeRect.top < bonusRect.bottom &&
      planeRect.bottom > bonusRect.top
    ) {
      bonus.remove();
      clearInterval(move);
      if (type === "star") activateStarBonus();
      if (type === "magnet") activateMagnetBonus();
    }

    if (bonusX < -100) {
      bonus.remove();
      clearInterval(move);
    }
  }, 16);
}

function activateStarBonus() {
  isInvincible = true;
  speedMultiplier = 2;
  plane.classList.add("invincible");
  setTimeout(() => {
    isInvincible = false;
    speedMultiplier = 1;
    plane.classList.remove("invincible");
  }, 5000);
}

function activateMagnetBonus() {
  hasMagnet = true;
  plane.classList.add("magnet");
  setTimeout(() => {
    hasMagnet = false;
    plane.classList.remove("magnet");
  }, 5000);
}

// --- Boucles de jeu ---
setInterval(createCloud, 1500);
setInterval(createCoin, 1000);
setInterval(() => createBonus("magnet"), 15000);
setInterval(() => {
  distance += 10 * speedMultiplier;
  distanceDisplay.textContent = distance;

  if (!bonusShown && distance >= 2500 && distance <= 3000) {
    createBonus("star");
    bonusShown = true;
  }
}, 200);


