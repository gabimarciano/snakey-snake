const snakeboard = document.getElementById("snakeboard");
const snakeboard_ctx = snakeboard.getContext("2d");
const vpRect = snakeboard.parentNode.getBoundingClientRect();
snakeboard.width = vpRect.width;
snakeboard.height = vpRect.height;

const middle_y = snakeboard.height / 2;

let snake = new Snake(snakeboard_ctx, { x: 240, y: middle_y }, 10, 20);
let fruit = new Fruit(snakeboard_ctx, 5, 25, 40);
let donut = new Donut(snakeboard_ctx, 24, 40);

document.addEventListener("keydown", keyboardControl);

init();

function init() {
    renderStaticBackground();
    fruit.genFruit();
    donut.newDonut();
    snake.render();
}

function gameLoop() {
    setTimeout(function onTick() {
        if (isGameEnded()) {
            alert('Game over');
            return;
        }
        if (snake.isPaused()) {
            return;
        }
        snake.move();
        const food = snakeEating();
        if (food.includes("fruit")) {
            snake.grow(fruit.color);
            fruit.genFruit();
        }
        if (food.includes("donut")) {
            snake.gainWeight();
            donut.newDonut();
        }
        renderActivityFrame();
        gameLoop();
    }, snake.getSpeed())
}

function renderActivityFrame() {
    snakeboard_ctx.clearRect(0, 0, snakeboard.width, snakeboard.height);
    fruit.render();
    donut.render();
    snake.render();
}

function snakeEating() {
    var food = [];
    if (eatingDistanceValid(snake, {
        x: fruit.x,
        y: fruit.y,
        size: fruit.fruitSize
    })) food.push("fruit");

    if (eatingDistanceValid(snake, {
        x: donut.x,
        y: donut.y,
        size: donut.size
    })) food.push("donut");
    return food;
}

function eatingDistanceValid(snake, food) {
    const snakeHead = snake.head();
    const snakeHeadCenter = {
        x: snakeHead.x + snake.snake_tile_size / 2,
        y: snakeHead.y + snake.snake_tile_size / 2
    }
    const x_distance = snakeHeadCenter.x - food.x;
    const y_distance = snakeHeadCenter.y - food.y;
    const distance = x_distance * x_distance + y_distance * y_distance;
    const eatingDistance = (snake.snake_tile_size + food.size) / 2;
    if (distance < eatingDistance * eatingDistance) {
        return true;
    }
    return false;
}

function keyboardControl(event) {
    const KEY_LEFT = 37;
    const KEY_UP = 38;
    const KEY_RIGHT = 39;
    const KEY_DOWN = 40;
    const KEY_SPACE = 32;

    const keyPressed = event.keyCode;

    if (keyPressed === KEY_LEFT) {
        if (snake.isMovingUp()) snake.turnLeft();
        if (snake.isMovingDown()) snake.turnRight();
    }
    if (keyPressed === KEY_RIGHT) {
        if (snake.isMovingUp()) snake.turnRight();
        if (snake.isMovingDown()) snake.turnLeft();
    }
    if (keyPressed === KEY_UP) {
        if (snake.isMovingLeft()) snake.turnRight();
        if (snake.isMovingRight()) snake.turnLeft();
    }
    if (keyPressed === KEY_DOWN) {
        if (snake.isMovingLeft()) snake.turnLeft();
        if (snake.isMovingRight()) snake.turnRight();
    }
    if (keyPressed === KEY_SPACE) {
        snake.pauseOrResumeMoving();
        if (!snake.isPaused()) {
            gameLoop();
        }
    }
}

function isGameEnded() {
    if (snake.isCollide()) {
        return true;
    }
    const hitLeftWall = snake.head().x < 0;
    const hitRightWall = snake.head().x > snakeboard.width - 10;
    const hitTopWall = snake.head().y < 0;
    const hitBottomWall = snake.head().y > snakeboard.height - 10;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}