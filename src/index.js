import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import update from 'immutability-helper';

class Board extends React.Component {
	constructor() {
		var defaultMax = 800;
		super();
		var board = this.gen2DArray(defaultMax);
		this.state = {
			size: [defaultMax,defaultMax],
			board: board,
			pixel: 5,
			generations: 10000,
			currGen: 0,
		}
		this.gen2DArray = this.gen2DArray.bind(this);
		this.drawGame = this.drawGame.bind(this); 
		this.getNeighbourCount= this.getNeighbourCount.bind(this);
		this.setBoardSize = this.setBoardSize.bind(this);
	}
	setBoardSize(pixels){
		var board = this.gen2DArray(pixels);
		this.setState({
			size:[pixels,pixels],
			board: board,
		});
	}
	gen2DArray(size){
		size = parseInt(size);
		var row = Array(size).fill(null);
		var  arr2D = row.map(col => {
			return Array(size).fill(null);
		});
		return arr2D; 
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
				//apply game rules 1 = life, 0 = death
				if(board[i][j] === 1) {
					//rule 1. Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
					if (neighbours < 2) boardCopy[i][j] = 0;
					//rule 2. Any live cell with two or three live neighbours lives on to the next generation.
					else if((neighbours >= 2) && (neighbours <= 3)) boardCopy[i][j] = 1;
					//rule 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
					else if(neighbours > 3) boardCopy[i][j] = 0;
				} else  {
					//rule 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
					if(board[i][j] !== 1 && neighbours == 3) boardCopy[i][j] = 1;		
				}
			}
		}
		return boardCopy;
	}
	//count number of live neighbours 
	getNeighbourCount(board, i,j){
		var max = this.state.size[0] -1;
		var jump = this.state.pixel;
		var count = 0;
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
		//set button to disable accessed by ref attribute
		this.start.setAttribute("disabled", "disabled");
		this.res.setAttribute("disabled", "disabled");
		this.gen.setAttribute("disabled", "disabled");
		var generations = this.state.generations;
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
				this.setState({currGen: year});
				year += 1;
				if(year == generations) {
					clearInterval(runGame);
					this.start.removeAttribute("disabled");
					this.res.removeAttribute("disabled");
					this.gen.removeAttribute("disabled");
				}
			},50);
		});
	}
	render() {
		return (
			<div>
				<div id='game'>
					<canvas id='board' width={this.state.size[0].toString()} height={this.state.size[1].toString()} style={{border:"1px solid black"}}>
					</canvas>
				</div>
				<div id="options">
					<button ref={start => {this.start = start;}} onClick={() => this.drawGame()}>start</button>
					<select ref={res => {this.res = res;}} onChange={(option)=> this.setBoardSize(option.target.value)}>
						<option value="800">800x800</option>
						<option value="1000">1000x1000</option>
						<option value="600">600x600</option>
						<option value="400">400x400</option>
					</select>
					<select ref={gen => {this.gen = gen;}} onChange={(option)=> this.setState({generations: option.target.value})}>
						<option value="10000">Generations: 10000</option>
						<option value="5000">Generations: 5000</option>
						<option value="1000">Generaions: 1000</option>
						<option value="500">Generations: 500</option>
					</select>
					<span ref={currGen => {this.currGen = currGen;}}>Current Generation: {this.state.currGen} </span>
				</div>
			</div>
		);
	}
}


ReactDOM.render(
  <Board />,
    document.getElementById('root')
);