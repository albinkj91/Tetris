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
		this.currentTetromino;
	}

	isCollision(tetromino){
		for(let i = 0; i < tetromino.blocks.length; i++){
			const x = tetromino.position.x + tetromino.blocks[i].x;
			const y = tetromino.position.y + tetromino.blocks[i].y;

			if(x == 9 || x < 0 || y == 20 || y < 0){
				return true;
			}

			if(this.field[y][x] !== 0)
				return true;
		}
	}

	place(tetromino){
		for(let i = 0; i < tetromino.blocks.length; i++){
			const y = tetromino.position.y+tetromino.blocks[i].y;
			const x = tetromino.position.x+tetromino.blocks[i].x;
			this.field[y][x] = tetromino.color;
		}
	}

	remove(tetromino){
		for(let i = 0; i < tetromino.blocks.length; i++){
			const y = tetromino.position.y+tetromino.blocks[i].y;
			const x = tetromino.position.x+tetromino.blocks[i].x;
			this.field[y][x] = 0;
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

class Vec2{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}

class Tetromino{
	constructor(blocks, position, color) {
		this.blocks = blocks;
		this.position = position;
		this.color = color;
	}

	rotate(){
		//TODO:
	}
}

const update = () =>{
	previousState = new Tetromino(game.currentTetromino.blocks,
		new Vec2(
			game.currentTetromino.position.x,
			game.currentTetromino.position.y),
		game.currentTetromino.color);

	game.currentTetromino.position.y += 1;
	game.remove(previousState);

	if(game.isCollision(game.currentTetromino)){
		game.place(previousState);
		console.log(game.currentTetromino);
		const squareBlocks = [new Vec2(0, 0), new Vec2(1, 0), new Vec2(0, 1), new Vec2(1, 1)];
			game.currentTetromino = new Tetromino(squareBlocks, new Vec2(4, 0), Colors.GREEN);
	}
	game.place(game.currentTetromino);
}

let start = 0;
const step = (timestamp) =>{
	const elapsed = timestamp - start;
	if(elapsed > 100){
		update();
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		game.renderField();
		start = timestamp;
	}
	requestAnimationFrame(step);
}

// *********************** START ************************
const squareBlocks = [new Vec2(0, 0), new Vec2(1, 0), new Vec2(0, 1), new Vec2(1, 1)];
const straightBlocks = [new Vec2(0, 0), new Vec2(1, 0), new Vec2(2, 0), new Vec2(3, 0)];
//const squareBlocks = [new Vec2(0, 0), new Vec2(1, 0), new Vec2(0, 1), new Vec2(1, 1)];
//const squareBlocks = [new Vec2(0, 0), new Vec2(1, 0), new Vec2(0, 1), new Vec2(1, 1)];

const startPos = new Vec2(3, 0);
//const square = new Tetromino(squareBlocks, startPos, Colors.RED);
const straight = new Tetromino(straightBlocks, startPos, Colors.RED);
let previousState = straight;
const game = new Game();
game.currentTetromino = straight;

game.renderField();
game.place(straight);
game.renderField();
//requestAnimationFrame(step);