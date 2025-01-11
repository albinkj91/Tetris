const body = document.querySelector('body');
const ctx = document.querySelector('#canvas').getContext('2d');
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const resetButton = document.querySelector('#reset');

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
		this.oBlocks = [new Vec2(1, 0), new Vec2(2, 0), new Vec2(1, 1), new Vec2(2, 1)];
		this.iBlocks = [new Vec2(0, 0), new Vec2(1, 0), new Vec2(2, 0), new Vec2(3, 0)];
		this.tBlocks = [new Vec2(0, 1), new Vec2(1, 1), new Vec2(2, 1), new Vec2(1, 0)];
		this.jBlocks = [new Vec2(0, 0), new Vec2(0, 1), new Vec2(1, 1), new Vec2(2, 1)];
		this.lBlocks = [new Vec2(0, 1), new Vec2(1, 1), new Vec2(2, 1), new Vec2(2, 0)];
		this.sBlocks = [new Vec2(1, 0), new Vec2(2, 0), new Vec2(0, 1), new Vec2(1, 1)];
		this.zBlocks = [new Vec2(0, 0), new Vec2(1, 0), new Vec2(1, 1), new Vec2(2, 1)];

		this.startPos = new Vec2(3, 0);
		this.i = new Tetromino(this.iBlocks, this.startPos, Colors.TEAL);
		this.o = new Tetromino(this.oBlocks, this.startPos, Colors.YELLOW);
		this.t = new Tetromino(this.tBlocks, this.startPos, Colors.PURPLE);
		this.j = new Tetromino(this.jBlocks, this.startPos, Colors.BLUE);
		this.l = new Tetromino(this.lBlocks, this.startPos, Colors.ORANGE);
		this.s = new Tetromino(this.sBlocks, this.startPos, Colors.GREEN);
		this.z = new Tetromino(this.zBlocks, this.startPos, Colors.RED);

		this.tetrominos = [this.i, this.o, this.t, this.j, this.l, this.s, this.z];

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

	isCollisionDown(tetromino){
		for(let i = 0; i < tetromino.blocks.length; i++){
			const x = tetromino.position.x + tetromino.blocks[i].x;
			const y = tetromino.position.y + tetromino.blocks[i].y;

			if(y == 20 || y < 0){
				return true;
			}

			if(this.field[y][x] !== 0)
				return true;
		}
	}

	isCollisionSide(tetromino){
		for(let i = 0; i < tetromino.blocks.length; i++){
			const x = tetromino.position.x + tetromino.blocks[i].x;
			const y = tetromino.position.y + tetromino.blocks[i].y;

			if(x == 10 || x < 0)
				return true;

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
						ctx.fillStyle = '#90dddd';
						break;
					case Colors.YELLOW:
						ctx.fillStyle = '#cccc30';
						break;
					case Colors.PURPLE:
						ctx.fillStyle = '#bb30bb';
						break;
					case Colors.BLUE:
						ctx.fillStyle = '#3030ff';
						break;
					case Colors.ORANGE:
						ctx.fillStyle = '#ffa530';
						break;
					case Colors.GREEN:
						ctx.fillStyle = '#30dd30';
						break;
					case Colors.RED:
						ctx.fillStyle = '#dd3030';
						break;
					default:
						ctx.fillStyle = 'black';
				}
				ctx.fillRect(fieldOffsetX + j*30, fieldOffsetY + i*30, 28, 28);
			}
		}
	}

	randomTetromino(){
		const random = Math.floor(Math.random() * 7);
		return this.tetrominos[random];
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
		console.log('rotating tetromino');
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

	if(game.isCollisionDown(game.currentTetromino)){
		game.place(previousState);
		const newTetromino = game.randomTetromino();
		
		game.currentTetromino = new Tetromino(newTetromino.blocks,
			new Vec2(newTetromino.position.x, newTetromino.position.y),
			newTetromino.color);
	}
	game.place(game.currentTetromino);
}

let game;
let reqId;
let previousState;
startButton.addEventListener('click', () =>{
	if(reqId === undefined)
		reqId = requestAnimationFrame(step)
});

stopButton.addEventListener('click', () =>{
	cancelAnimationFrame(reqId)
	reqId = undefined;
});

resetButton.addEventListener('click', () =>{
	game = new Game();
	init()
});

body.addEventListener('keydown', (e) =>{
	switch(e.key){
		case 'ArrowUp':
			game.currentTetromino.rotate();
			game.place(game.currentTetromino);
			break;
		case 'ArrowLeft':
			game.remove(game.currentTetromino);
			game.currentTetromino.position.x -= 1;
			if(game.isCollisionSide(game.currentTetromino)){
				game.currentTetromino.position.x += 1;
			}
			game.place(game.currentTetromino);
			break;
		case 'ArrowRight':
			game.remove(game.currentTetromino);
			game.currentTetromino.position.x += 1;
			if(game.isCollisionSide(game.currentTetromino)){
				game.currentTetromino.position.x -= 1;
			}
			game.place(game.currentTetromino);
			break;
		case 'ArrowDown':
			if(resetKey)
				return;
			game.remove(game.currentTetromino);
			game.currentTetromino.position.y += 1;
			if(game.isCollisionDown(game.currentTetromino)){
				game.currentTetromino.position.y -= 1;
				resetKey = true;
			}
			game.place(game.currentTetromino);
			break;
		default:
			console.log('invalid keyboard input');
			break;
	}
});

body.addEventListener('keyup', () => {resetKey = false});

let start = 0;
const step = (timestamp) =>{
	const elapsed = timestamp - start;
	if(elapsed > 300){
		update();
		start = timestamp;
	}
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	game.renderField();
	reqId = requestAnimationFrame(step);
};

const init = () =>{
	game = new Game();
	const randomTetromino = game.randomTetromino();

	game.currentTetromino = new Tetromino(randomTetromino.blocks,
		new Vec2(randomTetromino.position.x, randomTetromino.position.y),
		randomTetromino.color);

	previousState = game.currentTetromino;
	game.renderField();
	game.place(game.currentTetromino);
	game.renderField();
};

init();