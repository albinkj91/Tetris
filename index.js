const ctx = document.querySelector("#canvas").getContext('2d');
const canvasWidth = ctx.width;
const canvasHeight = ctx.height;
const fieldOffsetX = 350;
const fieldOffsetY = 100;

class Field{
	constructor(){
		this.blocks = [
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

	place(tetromino){
		if(tetromino.x > 9 || tetromino.x < 0 || tetromino.y > 19 || tetromino.y < 0)
			throw new RangeError("Tetromino can't be placed outside field boundary.");
	}
}

class Tetromino{
	constructor(blocks, x, y, color) {
		this.blocks = blocks;
		this.x = x;
		this.y = y;
		this.color = color;
	}

	rotate(){
		//TODO:
	}
}

const drawTetromino = (tetromino) =>{
	//TODO:
}

const renderField = (field) =>{
	for(let i = 0; i < field.blocks.length; i++){
		for(let j = 0; j < field.blocks[i].length; j++){
			switch(field.blocks[i][j]){
				case 0:
					ctx.fillStyle = "#90ffff";
					ctx.fillRect(fieldOffsetX + j*30, fieldOffsetY + i*30, 28, 28);
					break;
				default:
					throw new Error("Invalid value on field");
			}
		}
	}
};

const randomizeTetromino = () =>{
	//TODO:
}

const update = () =>{
	currentTetromino.y += 1;
	field.place(currentTetromino);
}

const step = (timestamp) =>{
	const elapsed = timestamp % 1000;
	if(elapsed > 990){
		update();
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		renderField();
	}
	requestAnimationFrame(step);
}

// *********************** START ************************
const squareBlocks = [[1, 1],
					  [1, 1]];

const square = new Tetromino(squareBlocks, 4, 19);
let currentTetromino = square;
const field = new Field();

renderField(field);
field.place(square);
//requestAnimationFrame(step);