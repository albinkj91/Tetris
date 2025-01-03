const ctx = document.querySelector("#canvas").getContext('2d');
const canvasWidth = ctx.width;
const canvasHeight = ctx.height;
const fieldOffsetX = 350;
const fieldOffsetY = 100;

const Colors = Object.freeze({
	RED: 1,
	BLUE: 2,
	GREEN: 3,
	YELLOW: 4,
	TEAL: 5,
	PURPLE: 6
});

class Game{
	constructor(){
		this.field = [
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0]
		];
	}

	isCollision(tetromino){
		for(let i = 0; i < tetromino.blocks.length; i++){
			if(tetromino.blocks[i][j] !== 0){
				this.field[tetromino.y+i][tetromino.x+j] = tetromino.blocks[i][j];
			}
		}
	}

	place(tetromino){
		if(tetromino.x > 9 || tetromino.x < 0 || tetromino.y > 19 || tetromino.y < 0)
			throw new RangeError("Tetromino can't be placed outside field boundary.");

		for(let i = 0; i < tetromino.blocks.length; i++){
			this.field[tetromino.y+tetromino.blocks[i].y][tetromino.x+tetromino.blocks[i].x] = 1;
		}
	}

	remove(tetromino){
		for(let i = 0; i < tetromino.blocks.length; i++){
			this.field[tetromino.y+tetromino.blocks[i].y][tetromino.x+tetromino.blocks[i].x] = 0;
		}
	}

	renderField(){
		for(let i = 0; i < this.field.length; i++){
			for(let j = 0; j < this.field[i].length; j++){
				switch(this.field[i][j]){
					case Colors.RED:
						ctx.fillStyle = "#dd3030";
						break;
					case Colors.BLUE:
						ctx.fillStyle = "#3030ff";
						break;
					case Colors.GREEN:
						ctx.fillStyle = "#30dd30";
						break;
					case Colors.YELLOW:
						ctx.fillStyle = "#aaaa30";
						break;
					case Colors.TEAL:
						ctx.fillStyle = "#90dddd";
						break;
					case Colors.PURPLE:
						ctx.fillStyle = "#bb30bb";
						break;
					default:
						ctx.fillStyle = "black";
				}
				ctx.fillRect(fieldOffsetX + j*30, fieldOffsetY + i*30, 28, 28);
			}
		}
	}
}

class Tetromino{
	constructor(blocks, x, y) {
		this.blocks = blocks;
		this.x = x;
		this.y = y;
	}

	rotate(){
		//TODO:
	}
}

class Vec2{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}

const update = () =>{
	previousState = new Tetromino(currentTetromino.blocks, currentTetromino.x, currentTetromino.y);
	currentTetromino.y += 1;
	game.remove(previousState);
	game.isCollision(currentTetromino);
	game.place(currentTetromino);
}

let start = 0;
const step = (timestamp) =>{
	const elapsed = timestamp - start;
	if(elapsed > 1000){
		update();
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		game.renderField();
		start = timestamp;
	}
	requestAnimationFrame(step);
}

// *********************** START ************************
const squareBlocks = [new Vec2(0, 0), new Vec2(1, 0), new Vec2(0, 1), new Vec2(1, 1)];
//const straightBlocks = [1, 1, 1, 1];

const square = new Tetromino(squareBlocks, 4, 0);
let currentTetromino = square;
let previousState = square;
const game = new Game();

game.renderField();
game.place(square);
game.renderField();
//requestAnimationFrame(step);