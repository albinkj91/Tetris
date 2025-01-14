const body = document.querySelector('body');
const ctx = document.querySelector('#canvas').getContext('2d');
const points = document.querySelector('#points');
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const resetButton = document.querySelector('#reset');

const canvasWidth = ctx.width;
const canvasHeight = ctx.height;
const fieldOffsetX = 350;
const fieldOffsetY = 100;
const phi = Math.PI / 2.0;

const Colors = Object.freeze({
	TEAL: 1,
	YELLOW: 2,
	PURPLE: 3,
	BLUE: 4,
	ORANGE: 5,
	GREEN: 6,
	RED: 7
});

class Vec2{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}

class Mat2{
	constructor(row0, row1){
		this.row0 = row0;
		this.row1 = row1;
	}

	mult(vec2){
		return new Vec2(Math.round(vec2.x * this.row0.x + vec2.y * this.row0.y),
			Math.round(vec2.x * this.row1.x + vec2.y * this.row1.y));
	}
}


class Tetromino{
	constructor(blocks, position, color){
		this.blocks = blocks;
		this.position = position;
		this.color = color;
	}

	rotate(phi){
		const rotateMatrix = new Mat2(new Vec2(Math.cos(phi), -Math.sin(phi)), new Vec2(Math.sin(phi), Math.cos(phi)));
		for(let i = 0; i < this.blocks.length; i++)
			this.blocks[i] = rotateMatrix.mult(this.blocks[i]);
	}
}

class Game{
	constructor(){
		this.points = 0;
		this.oBlocks = [new Vec2(0, 0), new Vec2(1, 0), new Vec2(0, 1), new Vec2(1, 1)];
		this.iBlocks = [new Vec2(-1, 0), new Vec2(0, 0), new Vec2(1, 0), new Vec2(2, 0)];
		this.tBlocks = [new Vec2(-1, 0), new Vec2(0, 0), new Vec2(1, 0), new Vec2(0, -1)];
		this.jBlocks = [new Vec2(-1, -1), new Vec2(-1, 0), new Vec2(0, 0), new Vec2(1, 0)];
		this.lBlocks = [new Vec2(-1, 0), new Vec2(0, 0), new Vec2(1, 0), new Vec2(1, -1)];
		this.sBlocks = [new Vec2(0, 0), new Vec2(1, 0), new Vec2(-1, 1), new Vec2(0, 1)];
		this.zBlocks = [new Vec2(-1, 0), new Vec2(0, 0), new Vec2(0, 1), new Vec2(1, 1)];

		this.startPos1 = new Vec2(4, 0);
		this.startPos2 = new Vec2(4, 1);
		this.o = new Tetromino(this.oBlocks, this.startPos1, Colors.YELLOW);
		this.i = new Tetromino(this.iBlocks, this.startPos1, Colors.TEAL);
		this.t = new Tetromino(this.tBlocks, this.startPos2, Colors.PURPLE);
		this.j = new Tetromino(this.jBlocks, this.startPos2, Colors.BLUE);
		this.l = new Tetromino(this.lBlocks, this.startPos2, Colors.ORANGE);
		this.s = new Tetromino(this.sBlocks, this.startPos1, Colors.GREEN);
		this.z = new Tetromino(this.zBlocks, this.startPos1, Colors.RED);

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

			if(y >= 20 || y < 0){
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
		const temp = this.tetrominos[random];
		return new Tetromino(structuredClone(temp.blocks), temp.position, temp.color);
	}

	checkRows(){
		for(let i = this.field.length - 1; i > 0; i--){
			let fullRow = true;
			for(let j = 0; j < this.field[i].length; j++){
				if(this.field[i][j] == 0){
					fullRow = false;
					break;
				}
			}
			if(fullRow)
				return i;
		}
		return 0;
	}

	clear(row){
		for(let j = 0; j < this.field[row].length; j++){
			this.field[row][j] = 0;
			let k = row;
			while(k > 0){
				this.field[k][j] = this.field[k-1][j];
				this.field[k-1][j] = 0;
				k--;
			}
		}
	}
}

const update = () =>{
	previousState = new Tetromino(structuredClone(game.currentTetromino.blocks),
		new Vec2(
			game.currentTetromino.position.x,
			game.currentTetromino.position.y),
		game.currentTetromino.color);

	game.currentTetromino.position.y += 1;
	game.remove(previousState);

	let rowCount = 0;
	if(game.isCollisionDown(game.currentTetromino)){
		game.place(previousState);
		let row = game.checkRows();
		while(row !== 0){
			rowCount++;
			if(delta > 50){
				delta -= 25;
			}
			game.clear(row);
			row = game.checkRows();
		}

		switch(rowCount){
			case 1:
				game.points += 100;
				break;
			case 2:
				game.points += 200;
				break;
			case 3:
				game.points += 500;
				break;
			case 4:
				game.points += 800;
				break;
		}
		points.innerHTML = game.points;
		const newTetromino = game.randomTetromino();
		
		game.currentTetromino = new Tetromino(structuredClone(newTetromino.blocks),
			new Vec2(newTetromino.position.x, newTetromino.position.y),
			newTetromino.color);
	}
	if(game.isCollisionDown(game.currentTetromino) || game.isCollisionSide(game.currentTetromino)){
		points.innerHTML = "GAME OVER";
		cancelAnimationFrame(reqId);
		reqId = undefined;
	}
	game.place(game.currentTetromino);
}

let game;
let reqId;
let previousState;
let resetKey;

startButton.addEventListener('click', () =>{
	body.addEventListener('keydown', keyEventHandler);
	if(reqId === undefined)
		reqId = requestAnimationFrame(step)
});

stopButton.addEventListener('click', () =>{
	cancelAnimationFrame(reqId)
	reqId = undefined;
});

resetButton.addEventListener('click', () =>init());

let keyDown = false;
const keyEventHandler = (e) =>{
	if(keyDown)
		return;
	switch(e.key){
		case 'ArrowUp':
			keyDown = true;
			game.remove(game.currentTetromino);
			game.currentTetromino.rotate(phi);
			if(game.isCollisionDown(game.currentTetromino) || game.isCollisionSide(game.currentTetromino)){
				game.currentTetromino.rotate(-phi);
			}
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
};

body.addEventListener('keyup', () => {
	resetKey = false;
	keyDown = false;
});

let start = 0;
let delta = 500;
const step = (timestamp) =>{
	const elapsed = timestamp - start;
	if(elapsed > delta){
		update();
		start = timestamp;
	}
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	game.renderField();
	if(reqId !== undefined)
		reqId = requestAnimationFrame(step);
};

const init = () =>{
	game = new Game();
	const randomTetromino = game.randomTetromino();

	game.currentTetromino = new Tetromino(structuredClone(randomTetromino.blocks),
		new Vec2(randomTetromino.position.x, randomTetromino.position.y),
		randomTetromino.color);

	previousState = game.currentTetromino;
	points.innerHTML = game.points;
	game.renderField();
	game.place(game.currentTetromino);
	game.renderField();
};

init();