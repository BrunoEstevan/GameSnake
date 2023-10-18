const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const audio = new Audio("sounds/pettcomida.mp3")


const size = 30

const initialPosition = { x: 270, y: 240 }

let snake = [initialPosition]

const incrementScore = () => {
    score.innerText = +score.innerText + 10
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor(),
    burgerImage: new Image()
}
food.burgerImage.src = "assets/burguer.png"
food.burgerImage.classList.add("food-image");

let direction, loopId

const drawFood = () => {

    const { x, y, burgerImage } = food;

    ctx.drawImage(burgerImage, x, y, size, size);



}

const drawSnake = () => {
    snake.forEach((position, index) => {
        if (index == snake.length - 1) {

            const headImage = new Image();
            headImage.src = "assets/30pxpett.jpg"
            ctx.drawImage(headImage, position.x, position.y, size, size);
        } else {

            ctx.fillStyle = "#964b00";
            const reductionFactor = 0;
            const rectWidth = size - ((snake.length - index - 1) * (size / snake.length));

            ctx.fillRect(position.x, position.y, rectWidth, size);
        }
    });
}


const moveSnake = () => {
    if (!direction) return

    const head = snake[snake.length - 1]

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }

    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }

    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }

    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }

    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 3
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

const chackEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision =
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision) {
        gameOver()
    }
}
const gameOverAudio = new Audio("sounds/morte.mp3");
let hasGameOverSoundPlayed = false;

const gameOver = () => {
    direction = undefined;

   
    if (!hasGameOverSoundPlayed) {
      
        gameOverAudio.play();
        hasGameOverSoundPlayed = true; 
    }
    document.body.classList.add("no-scroll");

    menu.style.display = "flex";
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(2px)";
}



buttonPlay.addEventListener("click", () => {
 
    hasGameOverSoundPlayed = false;

    score.innerText = "00";
    menu.style.display = "none";
    canvas.style.filter = "none";

    snake = [initialPosition];
    document.body.classList.remove("no-scroll");


    
    gameLoop();
});



const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    chackEat()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    }, 300)
}

gameLoop()

document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direction != "left") {
        direction = "right"
    }

    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }

    if (key == "ArrowDown" && direction != "up") {
        direction = "down"
    }

    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})


const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);



let touchStartX = null;
let touchStartY = null;

document.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;

   
    event.preventDefault();
});

document.addEventListener('touchmove', (event) => {
    if (touchStartX === null || touchStartY === null) return;

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
       
        if (deltaX > 0) {
           
            direction = 'right';
        } else {
            
            direction = 'left';
        }
    } else {
        
        if (deltaY > 0) {
           
            direction = 'down';
        } else {
            
            direction = 'up';
        }
    }

    
    touchStartX = null;
    touchStartY = null;

    
    event.preventDefault();
});
