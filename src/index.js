import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Board extends React.Component {
	/**
	*states
	*@size, size of canvas Length and Width
	*@board, current Game
	*@pixel, size of pixel (square) for live squares
	*@generations, limit for how many times the game will run
	*@currYear, current interation in @generations
	*@pause, toggler for pause/start button, false = start, true = pause
	*/
	constructor() {
		var defaultMax = 800;
		super();
		var game = this.gen2DArray(defaultMax);
		this.state = {
			size: [defaultMax,defaultMax],
			board: game,
			pixel: 5,
			generations: 10000,
			currYear: 0,
			pause: false,
		}
		this.setBoard = this.setBoard.bind(this);
		this.copyBoard = this.copyBoard.bind(this);
		this.gen2DArray = this.gen2DArray.bind(this);
		this.runGame = this.runGame.bind(this); 
		this.getNeighbourCount= this.getNeighbourCount.bind(this);
		this.setBoardSize = this.setBoardSize.bind(this);
		this.handleStart = this.handleStart.bind(this);
		this.handlePause = this.handlePause.bind(this);
		this.toggleStartPause = this.toggleStartPause.bind(this);
	}
  
	componentDidMount(){
		var game = this.copyBoard(game);
		game = this.setBoard(game);
		this.setState({board:game});
	}
  
	setBoardSize(pixels){
		var board = this.gen2DArray(pixels);
		this.setState({
			size:[pixels,pixels],
			board: board,
		});
	}
  
	/* create a 2D array
	* @size, legnth and width of array
	* @return, 2D array of @size length and width with null place holder values
	*/
	gen2DArray(size){
		size = parseInt(size);
		var row = Array(size).fill(null);
		var  arr2D = row.map(col => {
			return Array(size).fill(null);
		});
		return arr2D; 
	}

	/* Fill in a 2D array (game) with random life values
	* @board, 2D array to fill
	*/
	setBoard(board) { 
		for(var i = 0; i < this.state.size[0]; i += this.state.pixel) {
			for(var j = 0; j < this.state.size[1]; j+= this.state.pixel) {
				var life = Math.floor((Math.random() * Math.floor(3)))
				if(life == 1) {
					board[i][j] = life;	
				} else {
					board[i][j] = 0;
				}			
			}
		}
		return board;
	}
  
	/* Make a deep copy of the state variable @board (2D array)
	* @copy, 2D array to copy
	* @return, copy of state varaible @board
	*/
	copyBoard(copy){
		copy = this.state.board.map((col) => {
			return col.slice(0);
		});
		return copy;
	}
	/* apply the game of life rules
	 * create copy of current generation and use the copy to simulate next generation
	* @currGen, game (2D array) at its current generation
	 * @return, next simulated generation (2d array) 
	*/
	gameOfLife(currGen){
		var nextGen = currGen.map(col => {
			return col.slice(0);
		});
		for(var i = 0; i < this.state.size[0]; i+= this.state.pixel) {
			for(var j = 0; j < this.state.size[1]; j+= this.state.pixel) {
				var neighbours = this.getNeighbourCount(currGen,i,j);
				//apply game rules 1 = life, 0 = death
				if(currGen[i][j] === 1) {
					//rule 1. Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
					if (neighbours < 2) nextGen[i][j] = 0;
					//rule 2. Any live cell with two or three live neighbours lives on to the next generation.
					else if((neighbours >= 2) && (neighbours <= 3)) nextGen[i][j] = 1;
					//rule 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
					else if(neighbours > 3) nextGen[i][j] = 0;
				} else  {
					//rule 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
					if(currGen[i][j] !== 1 && neighbours == 3) nextGen[i][j] = 1;		
				}
			}
		}
		return nextGen;
	}
	/* count number of live neighbours
	* @currGen, current Game generation (2D array)
	* @i, index for rows
	* @j, index for colums
	* @return, count of neighbours in relation to life at @i and @j
	*/
	getNeighbourCount(currGen, i,j){
		var max = this.state.size[0] -1;
		var jump = this.state.pixel;
		var count = 0;
		if(i + jump <= max) {
			if(currGen[i+jump][j] === 1) count += 1;
		}
		if(i + jump <= max && j - jump >=0) {
			if(currGen[i+jump][j-jump] === 1) count += 1;
		}
		if(i + jump <= max && j + jump <= max) {
			if(currGen[i+jump][j + jump] === 1) count += 1;
		}
		if(i - jump >= 0) {
			if(currGen[i-jump][j] === 1) count += 1;
		}
		if(i - jump >= 0 && j - jump >=0) {
			if(currGen[i-jump][j - jump] === 1) count += 1;
		}
		if(i - jump >= 0 && j + jump <= max) {
			if(currGen[i-jump][j + jump] === 1) count += 1;
		}
		if(j + jump <= max) {
			if(currGen[i][j+jump] === 1) count += 1;
		}
		if(j - jump >= 0) {
			if(currGen[i][j-jump] === 1) count += 1;
		}
		return count;
	}

	runGame() {
    	//set up game variables
		var generations = this.state.generations;
		var year = this.state.currYear;
		var currGen = this.copyBoard();
		var canvas = document.getElementById('board');
		var ctx = canvas.getContext('2d');
    	//color in canvas (game board)
		ctx.fillStyle = "#FF0000";
    	//run game to states@generation intervals
		var runGame = setInterval(()=>{
			ctx.clearRect(0,0,this.state.size[0],this.state.size[1]);
			for(var i = 0; i < this.state.size[0]; i += this.state.pixel) {
				for(var j = 0; j < this.state.size[1]; j += this.state.pixel) {
					if(currGen[i][j] === 1) ctx.fillRect(i,j,this.state.pixel,this.state.pixel);
				}
			}
      		//apply game rules and get next generation simulation
			currGen = this.gameOfLife(currGen);
      		//set up next generation variables
			this.setState({currYear: year});
			year += 1;
			if(year == generations) {
				clearInterval(runGame);
				this.start.removeAttribute("disabled");
				this.res.removeAttribute("disabled");
				this.gen.removeAttribute("disabled");
			} else if (this.state.pause) {
				clearInterval(runGame);
				this.setState({board: currGen});
			}
		},70);
	}
	/* pauses game at current generation
   * @gameID, id for pausing interval 
   */
	handlePause(gameID){
		this.start.removeAttribute("disabled");
		this.setState({pause: true});
		this.toggleStartPause(true);
	}
	/* starts game from current generation 
	* @gameID, id for pausing interval 
	*/
	handleStart(gameID){   
		this.res.setAttribute("disabled", "disabled");   
		this.gen.setAttribute("disabled", "disabled");  
		this.setState({pause:false});
		this.toggleStartPause(false);   
		this.runGame();	
	}
	/* show start or pause button
	* @pause, boolean to show start or pause button, true = pause, false = start
	*/
	toggleStartPause(pause){
		if(!pause){
			this.pause.removeAttribute("hidden");
			this.start.setAttribute("hidden", "true");
		} else {
			this.start.removeAttribute("hidden");
			this.pause.setAttribute("hidden", "true");
		}
	}
  
  render() {
    return(
  		<div>
	        <h1>
	          <a 
	            href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" 
	            target="_blank">
	            Conways Game of Life
	          </a>
	        </h1>
			<div id='boardContainer'>
				<canvas 
		            id='board' 
		            width={this.state.size[0].toString()} 
		            height={this.state.size[1].toString()}
	            >
	          	</canvas>
			</div>        
        	<div className="optionMenu">
				<button 
            		ref={start => {this.start = start;}} 
            		onClick={() => this.handleStart()}
        		>
            		START
          		</button>
				<button 
            		hidden 
		            ref={pause => {this.pause = pause;}} 
		            onClick={() => this.handlePause()}
	            >
		            PAUSE
         		</button>
				<select 
		            ref={res => {this.res = res;}} 
		            onChange={(option)=> this.setBoardSize(option.target.value)}>
						<option value="800">800x800</option>
						<option value="700">700x700</option>
						<option value="600">600x600</option>
						<option value="500">500x500</option>
				>
				</select>
      			<select 
            		ref={gen => {this.gen = gen;}} 
            		onChange={(option)=> this.setState({generations: option.target.value})}
        		>
					<option value="10000"><p>Generations: 10000</p></option>
					<option value="5000">Generations: 5000</option>
					<option value="1000">Generaions: 1000</option>
					<option value="500">Generations: 500</option>
				</select>
          		<span> Current Generation: {this.state.currYear} </span>      
    		</div>
		</div>
    );
  }
}

ReactDOM.render(
  <Board />,
    document.getElementById('root')
);
