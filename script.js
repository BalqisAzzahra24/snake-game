const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');

const gridSize = 20;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

let snake = [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }];
let food = { x: 5, y: 5 };   // posisi awal makanan
let direction = 'right';
let score = 0;
let gameRunning = true;

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "green";
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function update() {
    if (!gameRunning) return;

    const head = { ...snake[0] };

    if (direction === 'up') head.y--;
    if (direction === 'down') head.y++;
    if (direction === 'left') head.x--;
    if (direction === 'right') head.x++;

    // 🔲 Tabrak dinding = game over
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
        endGame();
        return;
    }

    // 🔲 Tabrak badan sendiri = game over
    for (let segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    // 🍎 Makan makanan
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();

        // 🔊 Mainkan suara makan
        const eatSound = document.getElementById('eatSound');
        eatSound.currentTime = 0;
        eatSound.play();

    } else {
        snake.pop();
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * gridWidth),
        y: Math.floor(Math.random() * gridHeight),
    };
}

function endGame() {
    gameRunning = false;
    gameOverElement.style.display = 'block';

    // 🔊 Suara Game Over
    const sound = document.getElementById('gameOverSound');
    sound.currentTime = 0;
    sound.play();

    // 🎵 Stop background music
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.pause();
}

function resetGame() {
    snake = [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }];
    direction = 'right';
    score = 0;
    scoreElement.textContent = score;
    gameRunning = true;
    gameOverElement.style.display = 'none';
    generateFood();

    // 🎵 Play background music again
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.play();
}

function gameLoop() {
    update();
    draw();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
    if (!gameRunning && e.key === 'Enter') resetGame();
});

resetGame();
setInterval(gameLoop, 150);

// 🎵 Fungsi tombol musik
function toggleMusic() {
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic.paused) {
        bgMusic.play();
    } else {
        bgMusic.pause();
    }
}
