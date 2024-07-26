const canvas = document.getElementById("myCanvas");  // 获取 canvas 元素
const ctx = canvas.getContext("2d");  // 获取绘图上下文

// 游戏状态对象，包含所有游戏参数和状态
const game = {
    ballRadius: 10,  // 球的半径
    ballX: canvas.width / 2,  // 球的初始 x 坐标
    ballY: canvas.height - 30,  // 球的初始 y 坐标
    dx: 2,  // 球在 x 方向的速度
    dy: -2,  // 球在 y 方向的速度

    paddleHeight: 10,  // 挡板高度
    paddleWidth: 75,  // 挡板宽度
    paddleX: (canvas.width - 75) / 2,  // 挡板的初始 x 坐标

    rightPressed: false,  // 标志右箭头键是否被按下
    leftPressed: false,  // 标志左箭头键是否被按下

    brickRowCount: 5,  // 砖块行数
    brickColumnCount: 3,  // 砖块列数
    brickWidth: 75,  // 砖块宽度
    brickHeight: 20,  // 砖块高度
    brickPadding: 10,  // 砖块间距
    brickOffsetTop: 30,  // 砖块距顶部的偏移
    brickOffsetLeft: 30,  // 砖块距左侧的偏移

    score: 0,  // 游戏得分
    lives: 3,  // 玩家生命数
    bricks: [],  // 砖块数组

    // 初始化砖块函数
    initializeBricks() {
        for (let col = 0; col < this.brickColumnCount; col++) {
            this.bricks[col] = [];
            for (let row = 0; row < this.brickRowCount; row++) {
                this.bricks[col][row] = {
                    x: (row * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft,
                    y: (col * (this.brickHeight + this.brickPadding)) + this.brickOffsetTop,
                    status: 1 // 每个砖块的状态，1 表示存在，0 表示被打掉
                };
            }
        }
    },

    // 遍历砖块
    traversalBricks(callback) {
        for (let col = 0; col < this.brickColumnCount; col++) {
            for (let row = 0; row < this.brickRowCount; row++) {
                callback(this.bricks[col][row]);
            }
        }
    }
};

game.initializeBricks();  // 初始化砖块

// 事件监听器，用于监听键盘事件
document.addEventListener("keydown", e => {
    if (e.code == "ArrowRight") {
        game.rightPressed = true;
    } else if (e.code == "ArrowLeft") {
        game.leftPressed = true;
    }
}, false);

document.addEventListener("keyup", e => {
    if (e.code == "ArrowRight") {
        game.rightPressed = false;
    } else if (e.code == "ArrowLeft") {
        game.leftPressed = false;
    }
}, false);

// 鼠标移动事件监听器，用于移动挡板
document.addEventListener("mousemove", e => {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        game.paddleX = relativeX - game.paddleWidth / 2;
    }
}, false);

// 封装阴影设置函数
const setShadow = (color, blur, offsetX, offsetY) => {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = offsetX;
    ctx.shadowOffsetY = offsetY;
};

// 碰撞检测函数
const collisionDetection = () => {
    game.traversalBricks(brick => {
        if (brick.status === 1) {
            if (game.ballX > brick.x && game.ballX < brick.x + game.brickWidth
                && game.ballY > brick.y && game.ballY < brick.y + game.brickHeight) {
                game.dy = -game.dy;
                brick.status = 0;
                game.score++;
                if (game.score == game.brickRowCount * game.brickColumnCount) {
                    alert("YOU WIN, CONGRATS!");  // 游戏胜利提示
                    document.location.reload();  // 重新加载页面
                }
            }
        }
    })
};

// 绘制球的函数
const drawBall = () => {
    setShadow("rgba(0, 0, 0, 0.5)", 10, 5, 5);
    ctx.beginPath();
    ctx.arc(game.ballX, game.ballY, game.ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FF4500";  // 亮红色
    ctx.fill();
    ctx.closePath();
    setShadow("rgba(0,0,0,0)", 0, 0, 0);  // 清除阴影设置
};

// 绘制挡板的函数
const drawPaddle = () => {
    ctx.beginPath();
    ctx.rect(game.paddleX, canvas.height - game.paddleHeight, game.paddleWidth, game.paddleHeight);
    ctx.fillStyle = "#006400";  // 深绿色
    ctx.fill();
    ctx.closePath();
};

// 绘制砖块的函数
const drawBricks = () => {
    setShadow("rgba(0, 0, 0, 0.5)", 4, 2, 2);
    game.traversalBricks((brick) => {
        if (brick.status === 1) {
            ctx.beginPath();
            ctx.fillStyle = "#FFFFFF";  // 砖块颜色
            ctx.rect(brick.x, brick.y, game.brickWidth, game.brickHeight);
            ctx.fill();
            ctx.strokeStyle = "#B22222"; // 深红色边框
            ctx.lineWidth = 2;
            ctx.strokeRect(brick.x, brick.y, game.brickWidth, game.brickHeight);
            ctx.closePath();
        }
    })
    setShadow("rgba(0,0,0,0)", 0, 0, 0);  // 清除阴影设置
};

// 绘制得分函数
const drawScore = () => {
    setShadow("rgba(0, 0, 0, 0.5)", 4, 2, 2);
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";  // 黑色
    ctx.fillText("Score: " + game.score, 8, 20);
    setShadow("rgba(0,0,0,0)", 0, 0, 0);  // 清除阴影设置
};

// 绘制生命数函数
const drawLives = () => {
    setShadow("rgba(0, 0, 0, 0.5)", 4, 2, 2);
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";  // 黑色
    ctx.fillText("Lives: " + game.lives, canvas.width - 65, 20);
    setShadow("rgba(0,0,0,0)", 0, 0, 0);  // 清除阴影设置
};

// 重置球位置函数
const resetBall = () => {
    game.ballX = canvas.width / 2;
    game.ballY = canvas.height - 30;
    game.dx = 2;
    game.dy = -2;
    game.paddleX = (canvas.width - game.paddleWidth) / 2;
};

// 更新球位置函数
const updateBallPosition = () => {
    const nextBallX = game.ballX + game.dx;
    const nextBallY = game.ballY + game.dy;

    // 碰到左右边界时反弹
    if (nextBallX > canvas.width - game.ballRadius || nextBallX < game.ballRadius) {
        game.dx = -game.dx;
    }

    // 碰到上边界时反弹
    if (nextBallY < game.ballRadius) {
        game.dy = -game.dy;
    } else if (nextBallY > canvas.height - game.ballRadius) {
        // 碰到下边界时检测是否打到挡板
        if (game.ballX > game.paddleX && game.ballX < game.paddleX + game.paddleWidth) {
            game.dy = -game.dy;
        } else {
            // 没打到挡板时减少生命数
            game.lives--;
            if (!game.lives) {
                alert("GAME OVER");  // 游戏结束提示
                document.location.reload();  // 重新加载页面
            } else {
                // 调用重置球位置函数
                resetBall();
            }
        }
    }

    game.ballX += game.dx;  // 更新球的 x 坐标
    game.ballY += game.dy;  // 更新球的 y 坐标
};

// 更新挡板的位置的函数
const updatePaddlePosition = () => {
    if (game.rightPressed && game.paddleX < canvas.width - game.paddleWidth) {
        game.paddleX += 7;
    } else if (game.leftPressed && game.paddleX > 0) {
        game.paddleX -= 7;
    }
};

// 主绘制函数，每帧调用一次
const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // 清除画布
    drawBricks();  // 绘制砖块
    drawBall();  // 绘制球
    drawPaddle();  // 绘制挡板
    drawScore();  // 绘制得分
    drawLives();  // 绘制生命数

    collisionDetection();  // 检测碰撞
    updateBallPosition();  // 更新球的位置
    updatePaddlePosition();  // 更新挡板的位置
    requestAnimationFrame(draw);  // 请求下一帧绘制
};

draw();  // 开始游戏
