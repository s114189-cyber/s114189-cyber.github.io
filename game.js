// 設置畫布和上下文
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 定義網格和顏色
const GRID_SIZE = 4;
const CELL_SIZE = canvas.width / GRID_SIZE;
const FRUIT_COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00']; // 紅色, 綠色, 藍色, 黃色

// 初始遊戲狀態
let grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

// 隨機生成水果
function spawnFruit() {
    const emptyCells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (!grid[y][x]) emptyCells.push({ x, y });
        }
    }
    if (emptyCells.length > 0) {
        const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const level = Math.floor(Math.random() * 4); // 隨機等級 0 到 3
        grid[y][x] = { level, color: FRUIT_COLORS[level] };
    }
}

// 畫出遊戲格子和水果
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

            const fruit = grid[y][x];
            if (fruit) {
                ctx.fillStyle = fruit.color;
                ctx.fillRect(x * CELL_SIZE + 5, y * CELL_SIZE + 5, CELL_SIZE - 10, CELL_SIZE - 10);
            }
        }
    }
}

// 合併相同的水果
function mergeFruits(fruits) {
    let merged = [];
    let i = 0;
    while (i < fruits.length) {
        if (i + 1 < fruits.length && fruits[i].level === fruits[i + 1].level) {
            merged.push({ ...fruits[i], level: fruits[i].level + 1, color: FRUIT_COLORS[fruits[i].level + 1] });
            i += 2;
        } else {
            merged.push(fruits[i]);
            i++;
        }
    }
    return merged;
}

// 處理水果移動
function moveFruits(direction) {
    let moved = false;
    if (direction === 'up') {
        for (let x = 0; x < GRID_SIZE; x++) {
            let stack = [];
            for (let y = 0; y < GRID_SIZE; y++) {
                if (grid[y][x]) stack.push(grid[y][x]);
            }
            stack = mergeFruits(stack);
            for (let y = 0; y < GRID_SIZE; y++) {
                grid[y][x] = stack[y] || null;
            }
            moved = true;
        }
    } else if (direction === 'down') {
        for (let x = 0; x < GRID_SIZE; x++) {
            let stack = [];
            for (let y = GRID_SIZE - 1; y >= 0; y--) {
                if (grid[y][x]) stack.push(grid[y][x]);
            }
            stack = mergeFruits(stack);
            for (let y = GRID_SIZE - 1; y >= 0; y--) {
                grid[y][x] = stack[GRID_SIZE - 1 - y] || null;
            }
            moved = true;
        }
    } else if (direction === 'left') {
        for (let y = 0; y < GRID_SIZE; y++) {
            let stack = [];
            for (let x = 0; x < GRID_SIZE; x++) {
                if (grid[y][x]) stack.push(grid[y][x]);
            }
            stack = mergeFruits(stack);
            for (let x = 0; x < GRID_SIZE; x++) {
                grid[y][x] = stack[x] || null;
            }
            moved = true;
        }
    } else if (direction === 'right') {
        for (let y = 0; y < GRID_SIZE; y++) {
            let stack = [];
            for (let x = GRID_SIZE - 1; x >= 0; x--) {
                if (grid[y][x]) stack.push(grid[y][x]);
            }
            stack = mergeFruits(stack);
            for (let x = GRID_SIZE - 1; x >= 0; x--) {
                grid[y][x] = stack[GRID_SIZE - 1 - x] || null;
            }
            moved = true;
        }
    }
    return moved;
}

// 處理鍵盤事件
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        if (moveFruits('up')) spawnFruit();
    } else if (e.key === 'ArrowDown') {
        if (moveFruits('down')) spawnFruit();
    } else if (e.key === 'ArrowLeft') {
        if (moveFruits('left')) spawnFruit();
    } else if (e.key === 'ArrowRight') {
        if (moveFruits('right')) spawnFruit();
    }
});

// 初始化遊戲
function initGame() {
    grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
    spawnFruit();
    spawnFruit();
    gameLoop();
}

// 遊戲主循環
function gameLoop() {
    drawGrid();
    requestAnimationFrame(gameLoop);
}

// 啟動遊戲
initGame();
