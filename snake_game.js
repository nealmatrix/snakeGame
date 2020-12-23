//GAME_PIXEL is the number of pixels on horizontal or vertical axis of the game board
const GAME_PIXEL = 40;
const TOTAL_GAME_PIXELS = Math.pow(GAME_PIXEL, 2);

//Create game board
const gameContainer = document.getElementById("gameContainer");

const createGameBoardPixels = () => {
    for (let i = 0; i < TOTAL_GAME_PIXELS; ++i){
        gameContainer.innerHTML = `${gameContainer.innerHTML} 
        <div class = "gameBoardPixel" id = "pixel${i}"></div>`
    }
}

const gameBoardPixels = document.getElementsByClassName("gameBoardPixel");

//Create food pixel
let currentFoodPosition = 0;
const createFood = () => {
    // remove previous food
    gameBoardPixels[currentFoodPosition].classList.remove("food");

    // add new food
    currentFoodPosition = Math.random();
    currentFoodPosition = Math.floor(currentFoodPosition * TOTAL_GAME_PIXELS); 
    gameBoardPixels[currentFoodPosition].classList.add("food");
}

//Snake

//Direction code (keyboard key codes for arrow keys)
const LEFT_DIR = "ArrowLeft";
const UP_DIR = "ArrowUp";
const RIGHT_DIR = "ArrowRight";
const DOWN_DIR = "ArrowDown";

//Snake original direction is RIGHT
let currentSnakeDirection = RIGHT_DIR;

//Change snake movement direction
const changeDirection = (newDirectionCode) => {
    console.log(newDirectionCode);
    if (newDirectionCode == currentSnakeDirection)
        return;
    
    if ((newDirectionCode == LEFT_DIR && currentSnakeDirection != RIGHT_DIR) ||
        (newDirectionCode == UP_DIR && currentSnakeDirection != DOWN_DIR) ||
        (newDirectionCode == RIGHT_DIR && currentSnakeDirection != LEFT_DIR) ||
        (newDirectionCode == DOWN_DIR && currentSnakeDirection != UP_DIR))
        currentSnakeDirection = newDirectionCode;
    else
        return;
}

//Snake starting position is at the middle of the game board
let currentSnakeHeadPosition = Math.floor(TOTAL_GAME_PIXELS / 2);

//Initial snake length
let snakeLength = 1000;

//Total food ate
let totalFoodAte = 0;

//Total blocks travelled
let totalBlocksTravelled = 0;

//Snake move
const moveSnake = () => {
    switch (currentSnakeDirection){
        case LEFT_DIR:
            --currentSnakeHeadPosition;
            if ((currentSnakeHeadPosition + GAME_PIXEL) % GAME_PIXEL == GAME_PIXEL - 1)
                currentSnakeHeadPosition += GAME_PIXEL;
            break;

        case UP_DIR:
            currentSnakeHeadPosition -= GAME_PIXEL;
            if (currentSnakeHeadPosition < 0)
                currentSnakeHeadPosition += TOTAL_GAME_PIXELS;
            break;

        case RIGHT_DIR:
            ++currentSnakeHeadPosition; 
            if (currentSnakeHeadPosition % GAME_PIXEL == 0)
                currentSnakeHeadPosition -= GAME_PIXEL;
            break;

        case DOWN_DIR:
            currentSnakeHeadPosition += GAME_PIXEL;
            if (currentSnakeHeadPosition >= TOTAL_GAME_PIXELS)
                currentSnakeHeadPosition -= TOTAL_GAME_PIXELS;
            break;

        default:
            break;
    }

    let currentSnakeHeadPixel = gameBoardPixels[currentSnakeHeadPosition];

    //Snake bites itself
    if (currentSnakeHeadPixel.classList.contains("snakeBodyPixel")){
        clearInterval(moveSnakeInterval);
        if (!alert(`you have ate ${totalFoodAte} food by travelling ${totalBlocksTravelled} blocks\nyour final length is ${snakeLength}`))
            window.location.reload();
    }

    //Turn gameBoardPixel into snakeBodyPixel
    currentSnakeHeadPixel.classList.add("snakeBodyPixel");

    setTimeout(() => {
        currentSnakeHeadPixel.classList.remove("snakeBodyPixel");    
    }, snakeLength);

    //Update travelled blocks
    ++totalBlocksTravelled;
    document.getElementById("blocksTravelled").textContent = totalBlocksTravelled;

    //Snake ate food
    if (currentSnakeHeadPixel.classList.contains("food")){
        ++totalFoodAte;
        document.getElementById("pointsEarned").textContent = totalFoodAte;
        
        snakeLength += 100;
        createFood();
    }

    
}

createGameBoardPixels();

createFood();

let moveSnakeInterval = setInterval(moveSnake, 80);

//Call changeDirection function on keyboard key-down event
addEventListener("keydown", e => changeDirection(e.key));

//On screen controller
document.getElementById("leftButton").addEventListener("click", () => changeDirection(LEFT_DIR));
document.getElementById("upButton").addEventListener("click", () => changeDirection(UP_DIR));
document.getElementById("rightButton").addEventListener("click", () => changeDirection(RIGHT_DIR));
document.getElementById("downButton").addEventListener("click", () => changeDirection(DOWN_DIR));
