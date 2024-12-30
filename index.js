const ctx = document.querySelector("#canvas").getContext('2d');
const xOffset = 350;
const yOffset = 100;

class Tetromino{
	constructor(blocks) {
		this.blocks = blocks;
	}
}

const drawTetromino = (tetromino) =>{
	if(tetrominoPosY > 18 * 30)
		tetrominoPosY = 18 * 30;
	ctx.fillStyle = "#ff00ff";
	for(let i = 0; i < tetromino.length; i++){
		for(let j = 0; j < tetromino[i].length; j++){
			if(tetromino[i][j] === 1){
				ctx.fillRect(xOffset + i*30 + tetrominoPosX, yOffset + j*30 + tetrominoPosY, 28, 28);
			}
		}
	}
}

const drawField = () =>{
	ctx.fillStyle = "#00ffff";
	for(let i = 0; i < 10; i++){
		for(let j = 0; j < 20; j++){
			ctx.fillRect(xOffset + i*30, yOffset + j*30, 28, 28);
		}
	}
};

function step(timestamp) {
	const elapsed = timestamp % 1000;
	if(elapsed > 990){
		tetrominoPosY += 30;
		ctx.clearRect(0, 0, 1000, 800);
		drawField();
		drawTetromino(tetromino);
	}
	requestAnimationFrame(step);
}

// *********************** START ************************
const squareBlocks = [[1, 1],
					  [1, 1]];

const square = new Tetromino(squareBlocks);
drawField();
drawTetromino(tetromino);
requestAnimationFrame(step);