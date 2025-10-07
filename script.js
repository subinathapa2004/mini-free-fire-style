const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

// Player
let player = { x: 180, y: 350, width: 40, height: 40, speed: 5 };

// Bullets
let bullets = [];

// Enemies
let enemies = [];
let enemySpeed = 2;

// Score
let score = 0;

// Keyboard input
let keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Shoot bullet
function shoot() {
  bullets.push({ x: player.x + player.width / 2 - 5, y: player.y, width: 10, height: 20 });
}

// Create enemy
function createEnemy() {
  let x = Math.random() * (canvas.width - 40);
  enemies.push({ x: x, y: -40, width: 40, height: 40 });
}

// Collision detection
function isColliding(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

// Draw everything
function draw() {
  // Clear canvas
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "#00ffcc";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Bullets
  ctx.fillStyle = "#ff3300";
  bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

  // Enemies
  ctx.fillStyle = "#ffcc00";
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.width, e.height));

  // Move bullets
  bullets.forEach((b, i) => {
    b.y -= 7;
    if (b.y + b.height < 0) bullets.splice(i, 1);
  });

  // Move enemies
  enemies.forEach((e, i) => {
    e.y += enemySpeed;

    // Collision with bullets
    bullets.forEach((b, j) => {
      if (isColliding(b, e)) {
        bullets.splice(j, 1);
        enemies.splice(i, 1);
        score += 1;
        document.getElementById("score").textContent = score;
      }
    });

    // Collision with player → Game Over
    if (isColliding(player, e)) {
      alert("💀 Game Over! Score: " + score);
      document.location.reload();
    }

    // Remove enemies if off screen
    if (e.y > canvas.height) enemies.splice(i, 1);
  });

  // Player movement
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += player.speed;
  if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
  if (keys["ArrowDown"] && player.y + player.height < canvas.height) player.y += player.speed;
  if (keys[" "] ) shoot(); // Space bar
}

// Enemy spawn interval
setInterval(createEnemy, 1000);

// Game loop
setInterval(draw, 30);
