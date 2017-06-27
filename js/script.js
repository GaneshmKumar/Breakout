var canvas = document.getElementById('canvas');
var canvasContext = canvas.getContext('2d');

var startGame = false;	
var paddleX, paddleY;
var ballX, ballY;
var ballSpeedX = config.ballSpeedX, ballSpeedY = config.ballSpeedY;
var blocks = [];
var blocksRemaining = 0, score = 0;
var gameOver = false;

window.onload = function() {	
	init();
	setInterval(function() {
		moveBall();
		drawAllOnScreen();
	}, config.speed / config.framesPerSecond);
	window.addEventListener('mousemove', handleMouseMove);
	window.addEventListener('mousedown', function() {
     startGame = true;
  	});
	window.addEventListener('keydown', function(e) {
		if(e.keyCode == 13)
		{
			gameOver = false;
			blocks = [];
			init();
		}
	});
}

function handleMouseMove(e) {
	var mousePos = calculateMousePos(e);
	paddleX = mousePos.x - config.paddleWidth / 2;	
}

function calculateMousePos(e) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = e.clientX - rect.left - root.scrollLeft;
	var mouseY = e.clientY - rect.top - root.scrollTop;
	return {x: mouseX, y: mouseY};
}

function init() {
	canvas.width = document.documentElement.clientWidth - 30;
	canvas.height = document.documentElement.clientHeight - 45;
	paddleX = (canvas.width / 2) - (config.paddleWidth / 2);
	paddleY = canvas.height - config.paddleHeight
	ballX = canvas.width / 2;
	ballY = canvas.height - 40;
	createBlocks();
}

function createBlocks() {
	var y = 50;
	var x = canvas.width / 20;
	var nextRowPos = x + config.blockWidth + 10;
	var row = config.blockRow;
	var col = config.blockColumn;
	for(var i = 0; i < row; i ++)
	{
		var temp = [];
		for(var j = 0; j < col; j ++)
		{
			var color = chooseBlockColor();
			temp.push({
				x: x,
				y: y,
				visible: true,
				color: color
			});
			blocksRemaining ++;
			x = x + config.blockWidth + 10;
		}
		x = nextRowPos;
		nextRowPos = x + config.blockWidth + 10;
		blocks.push(temp);
		col -= 2
		y = y + config.blockHeight + 10;
	}
}

function displayBlocks() {
	var row = config.blockRow;
	var col = config.blockColumn;
	for(var i = 0; i < row; i ++)
	{
		for(var j = 0; j < col; j ++)
		{
			if(blocks[i][j].visible)
			{
				drawRect(blocks[i][j].x, blocks[i][j].y, config.blockWidth, config.blockHeight, blocks[i][j].color);	
			}
		}
		col -= 2;
	}
}

function chooseBlockColor() {
	var index = Math.floor(Math.random() * config.blockColors.length);
	return config.blockColors[index];
}

function moveBall() {
	ballX += ballSpeedX;
	ballY -= ballSpeedY;
	if(ballX < 0)
	{
		ballSpeedX = -ballSpeedX;
	}
	if(ballX > canvas.width)
	{
		ballSpeedX = -ballSpeedX;
	}
	if(ballY < 0)
	{
		ballSpeedY = -ballSpeedY;
	}
	if(ballY > canvas.height)
	{
		if(ballX > paddleX && ballX < paddleX + config.paddleWidth && ballY >= paddleY)
		{
			ballSpeedY = -ballSpeedY;	
		}
		else
		{
			resetGame();
		}	
	}
	checkCollision();
}

function checkCollision() {
	var row = config.blockRow;
	var col = config.blockColumn;
	for(var i = 0; i < row; i ++)
	{
		for(var j = 0; j < col; j ++)
		{
			if(ballX >= blocks[i][j].x && ballX <= blocks[i][j].x + config.blockWidth && ballY >= blocks[i][j].y && ballY <= blocks[i][j].y + config.paddleHeight && blocks[i][j].visible == true)
			{
				blocks[i][j].visible = false;
				blocksRemaining --;
				score ++;
				if(blocksRemaining == 0)
				{
					resetGame();
				}
			}
		}
		col -= 2;
	}
}

function drawAllOnScreen() {
	//computerPlay();	
	drawRect(0, 0, canvas.width, canvas.height, '#1D1F20');
	if(!startGame)
  	{
      drawText('Controls: Move mouse right and left', (canvas.width / 2) - 110, canvas.height / 2 - 10, '#ffffff');  
      drawText('Click on the screen to start game', (canvas.width / 2) - 100, canvas.height / 2 + 10, '#ffffff');
      return;
  	}
	if(gameOver)
	{
		drawText('Game Over !!!', (canvas.width / 2) - 50, canvas.height / 2 - 10, '#ffffff');
		drawText('Press ENTER to start a new game', (canvas.width / 2) - 100, canvas.height / 2 + 10, '#ffffff');
		return;
	}
	drawRect(paddleX, paddleY, config.paddleWidth, config.paddleHeight, '#ffffff');
	drawCircle(ballX, ballY, config.radius, 0, Math.PI * 2, true, '#ffffff');
	drawText("Score: " + score, (canvas.width / 2) - 10, 20);
	displayBlocks();
}

function resetGame() {
	gameOver = true;
	score = 0;
	blocksRemaining = 0;
}

/*function computerPlay() {
	paddleX = ballX - 20;
}*/