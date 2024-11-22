const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let square = { x: 50, y: 300, width: 20, height: 20, gravity: 0.5, velocity: 0, jump: -8 };
let pipes = [];
let pipeWidth = 50;
let gapHeight = 150;
let score = 0;
let gameOver = false;

// Initialize pipes
function createPipe() {
    let gapY = Math.random() * (canvas.height - gapHeight - 100) + 50; // Gap position
    pipes.push({ x: canvas.width, gapY: gapY });
}

// Draw square
function drawSquare() {
    ctx.fillStyle = "#e63946";
    ctx.fillRect(square.x, square.y, square.width, square.height);
}

// Draw pipes
function drawPipes() {
    ctx.fillStyle = "#2a9d8f";
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.gapY);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.gapY + gapHeight, pipeWidth, canvas.height - pipe.gapY - gapHeight);
    });
}

// Update game logic
function update() {
    if (gameOver) return;

    // Apply gravity to square
    square.velocity += square.gravity;
    square.y += square.velocity;

    // Check collision with pipes
    pipes.forEach(pipe => {
        if (
            square.x < pipe.x + pipeWidth &&
            square.x + square.width > pipe.x &&
            (square.y < pipe.gapY || square.y + square.height > pipe.gapY + gapHeight)
        ) {
            gameOver = true;
        }

        // Check if pipe is out of screen and increase score
        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
            score++;
        }
    });

    // Check collision with ground or ceiling
    if (square.y + square.height > canvas.height || square.y < 0) {
        gameOver = true;
    }

    // Move pipes
    pipes.forEach(pipe => (pipe.x -= 2));

    // Spawn new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }

    draw();
}

// Draw the game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSquare();
    drawPipes();

    // Display score
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, canvas.height / 2 - 50, canvas.width, 100);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
    }
}

// Restart the game
function restartGame() {
    square.y = 300;
    square.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    createPipe();
}

// Jump when clicking or pressing a key
function jump() {
    if (!gameOver) {
        square.velocity = square.jump;
    } else {
        restartGame();
    }
}

// Event listeners
canvas.addEventListener("click", jump);
document.addEventListener("keydown", e => {
    if (e.key === " " || e.key === "ArrowUp") jump();
});

// Start game loop
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

createPipe();
gameLoop();
