import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import update from 'immutability-helper';

class Square extends React.Component {
	render() {
		return (
			<canvas className='col' style={{border:"1px solid black"}}></canvas>
		)
	}
}

class Board extends React.Component {
	constructor() {
		var max = 800;
		super();
		var row = Array(max).fill(null);
		var board = row.map(col => {
			return Array(max).fill(null);
		});
		this.state = {
			size: [max,max],
			board: board,
			pixel: 10,
		}
		this.drawGame = this.drawGame.bind(this); 
		this.getNeighbourCount= this.getNeighbourCount.bind(this);
	}

	generateLife() {
		var boardCopy = this.state.board.map(col => {
			return col.slice();
		}) 
		for(var i = 0; i < this.state.size[0]; i += this.state.pixel) {
			for(var j = 0; j < this.state.size[1]; j+= this.state.pixel) {
				var life = Math.floor((Math.random() * Math.floor(5)))
				if(life == 1) {
					boardCopy[i][j] = life;	
				} else {
					boardCopy[i][j] = 0;
				}
				
			}
		}
		//boardCopy[50][30] = 1;
		boardCopy[40][40] = 1;
		boardCopy[50][40] = 1;
		boardCopy[60][40] = 1;
		return boardCopy;
	}
	//apply the game of life rules to current game
	gameOfLife(board){
		var boardCopy = board.map(col => {
			return col.slice(0);
		});
		for(var i = 0; i < this.state.size[0]; i+= this.state.pixel) {
			for(var j = 0; j < this.state.size[1]; j+= this.state.pixel) {
				var neighbours = this.getNeighbourCount(board,i,j);
				if(board[i][j] === 1) {
					if (neighbours < 2) {boardCopy[i][j] = 0; /*alert(i +", "+", " + j + ": "+ neighbours)*/}
					else if((neighbours >= 2) && (neighbours <= 3)) {boardCopy[i][j] = 1; /*alert(i +", "+", " + j + ": "+ neighbours)*/}
					else if(neighbours > 3) {boardCopy[i][j] = 0;/*alert(i +", "+", " + j + ": "+ neighbours)*/}
				} else if(board[i][j] !== 1 && neighbours == 3) {
					boardCopy[i][j] = 1;
					//alert(i +", "+", " + j + ": "+ neighbours)
				}
			}
		}
		return boardCopy;
	}
	getNeighbourCount(board, i,j){
		var max = this.state.size[0] -1;
		var jump = this.state.pixel;
		var count = 0;
		//check if edge
		/*
		if(i + this.state.pixel <= this.state.size[0]-1){
			if(board[i+this.state.pixel][j] === 1) {count += 1;}
		}
		if(j + this.state.pixel <= this.state.size[1]-1){
			if(board[i][j+this.state.pixel] === 1) {
				count += 1; 
				if(i === 50 && j === 30) {
					alert("+j " + count);

				}
			}
		}
		if(i + this.state.pixel <= this.state.size[0]-1 && j + this.state.pixel <= this.state.size[1]-1) {
			if(board[i+this.state.pixel][j+this.state.pixel] === 1) {count += 1; }
					if(i === 50 && j === 30) {
			alert("++ij " + count);
		}
		}
		if(i - this.state.pixel >= 0) {
			if(board[i-this.state.pixel][j] === 1) {count += 1;}
		}
		if(j - this.state.pixel >= 0 ) {
			if(board[i][j-this.state.pixel] === 1) {count += 1; }
		}
		if((i - this.state.pixel >= 0) && j - (this.state.pixel >= 0)) {
			var ii = i - 10;
			var jj = j - 10;

			if(board[i-this.state.pixel][j-this.state.pixel] === 1) {count += 1;}
					if(i === 50 && j === 30) {
			alert("--ij " + count);
			alert(ii + ":" + jj);
		}
		}
		if((j + this.state.pixel > this.state.size[1]) && (j - this.state.pixel >= 0)) {
			if(board[i+this.state.pixel][j-this.state.pixel] === 1) {count += 1;}
		}
		if((i - this.state.pixel >=0) && (j + this.state.pixel > this.state.size[0])) {
			if(board[i-this.state.pixel][j+this.state.pixel] === 1) {count += 1;}
		}

		if(i - this.state.pixel >= 0 && j + this.state.pixel <=this.state.pixel) count += 1;
				if(i === 50 && j === 30) {
			alert("neighours: " +count);
		}
		*/
		if(i + jump <= max) {
			if(board[i+jump][j] === 1) count += 1;
		}
		if(i + jump <= max && j - jump >=0) {
			if(board[i+jump][j-jump] === 1) count += 1;
		}
		if(i + jump <= max && j + jump <= max) {
			if(board[i+jump][j + jump] === 1) count += 1;
		}
		if(i - jump >= 0) {
			if(board[i-jump][j] === 1) count += 1;
		}
		if(i - jump >= 0 && j - jump >=0) {
			if(board[i-jump][j - jump] === 1) count += 1;
		}
		if(i - jump >= 0 && j + jump <= max) {
			if(board[i-jump][j + jump] === 1) count += 1;
		}
		if(j + jump <= max) {
			if(board[i][j+jump] === 1) count += 1;
		}
		if(j - jump >= 0) {
			if(board[i][j-jump] === 1) count += 1;
		}
		return count;
	}
	drawGame() {
		this.start.setAttribute("disabled", "disabled");
		var generations = 200;
		var year = 0;
		var copy = this.generateLife();
		var board = document.getElementById('board');
		var ctx = board.getContext('2d');
		this.setState({board: copy},() => {
			ctx.fillStyle = "#FF0000";
			var runGame = setInterval(()=>{
				ctx.clearRect(0,0,this.state.size[0],this.state.size[1]);
				for(var i = 0; i < this.state.size[0]; i += this.state.pixel) {
					for(var j = 0; j < this.state.size[1]; j += this.state.pixel) {
						if(copy[i][j] === 1) ctx.fillRect(i,j,this.state.pixel,this.state.pixel);
					}
				}
				copy = this.gameOfLife(copy);
				year += 1;
				if(year == generations) {
					clearInterval(runGame);
					this.start.removeAttribute("disabled");
				}
			},500);
		});
	}
	render() {
		return (
			<div>
				<canvas id='board' width={this.state.size[0].toString()} height={this.state.size[1].toString()} style={{border:"1px solid black"}}>
				</canvas>
				<button ref={start => {this.start = start;}} onClick={() => this.drawGame()}>clickme</button>
			</div>
		);
	}
}


ReactDOM.render(
  <Board />,
    document.getElementById('root')
);