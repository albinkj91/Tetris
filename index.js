const ctx = document.querySelector("#canvas").getContext('2d');
const canvasWidth = ctx.width;
const canvasHeight = ctx.height;
const fieldOffsetX = 350;
const fieldOffsetY = 100;

const Colors = Object.freeze({
	TEAL: 1,
	YELLOW: 2,
	PURPLE: 3,
	BLUE: 4,
	ORANGE: 5,
	GREEN: 6,
	RED: 7
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
					case Colors.TEAL:
						ctx.fillStyle = "#90dddd";
						break;
					case Colors.YELLOW:
						ctx.fillStyle = "#cccc30";
						break;
					case Colors.PURPLE:
						ctx.fillStyle = "#bb30bb";
						break;
					case Colors.BLUE:
						ctx.fillStyle = "#3030ff";
						break;
					case Colors.ORANGE:
						ctx.fillStyle = "#ffa530";
						break;
					case Colors.GREEN:
						ctx.fillStyle = "#30dd30";
						break;
					case Colors.RED:
						ctx.fillStyle = "#dd3030";
						break;
					default:
						ctx.fillStyle = "black";
				}
				ctx.fillRect(fieldOffsetX + j*30, fieldOffsetY + i*30, 28, 28);
			}
		}
	}

	randomTetromino(){
		const random = Math.floor(Math.random() * 7);
		return tetrominos[random];
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
		const newTetromino = game.randomTetromino();
		
		game.currentTetromino = new Tetromino(newTetromino.blocks,
			new Vec2(newTetromino.position.x, newTetromino.position.y),
			newTetromino.color);
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
const oBlocks = [new Vec2(1, 0), new Vec2(2, 0), new Vec2(1, 1), new Vec2(2, 1)];
const iBlocks = [new Vec2(0, 0), new Vec2(1, 0), new Vec2(2, 0), new Vec2(3, 0)];
const tBlocks = [new Vec2(0, 1), new Vec2(1, 1), new Vec2(2, 1), new Vec2(1, 0)];
const jBlocks = [new Vec2(0, 0), new Vec2(0, 1), new Vec2(1, 1), new Vec2(2, 1)];
const lBlocks = [new Vec2(0, 1), new Vec2(1, 1), new Vec2(2, 1), new Vec2(2, 0)];
const sBlocks = [new Vec2(1, 0), new Vec2(2, 0), new Vec2(0, 1), new Vec2(1, 1)];
const zBlocks = [new Vec2(0, 0), new Vec2(1, 0), new Vec2(1, 1), new Vec2(2, 1)];

const startPos = new Vec2(3, 0);
const i = new Tetromino(iBlocks, startPos, Colors.TEAL);
const o = new Tetromino(oBlocks, startPos, Colors.YELLOW);
const t = new Tetromino(tBlocks, startPos, Colors.PURPLE);
const j = new Tetromino(jBlocks, startPos, Colors.BLUE);
const l = new Tetromino(lBlocks, startPos, Colors.ORANGE);
const s = new Tetromino(sBlocks, startPos, Colors.GREEN);
const z = new Tetromino(zBlocks, startPos, Colors.RED);

const tetrominos = [i, o, t, j, l, s, z];

const game = new Game();
const randomTetromino = game.randomTetromino();

game.currentTetromino = new Tetromino(randomTetromino.blocks,
	new Vec2(randomTetromino.position.x, randomTetromino.position.y),
	randomTetromino.color);

let previousState = game.currentTetromino;

game.renderField();
game.place(game.currentTetromino);
game.renderField();
requestAnimationFrame(step);