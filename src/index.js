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
		super();
		var row = Array(800).fill(null);
		var board = row.map(col => {
			return Array(800).fill(null);
		});
		this.state = {
			size: [800,800],
			board: board,
		}
		this.drawGame = this.drawGame.bind(this); 
	}

	generateLife() {
		var boardCopy = this.state.board.map(col => {
			return col.slice();
		})
		for(var i = 0; i < this.state.size[0]; i ++) {
			for(var j = 0; j < this.state.size[1]; j++) {
				var life = Math.floor((Math.random() * Math.floor(20)))
				boardCopy[i][j] = life;
			}
		}
		return boardCopy;
	}

	drawGame() {
		this.start.setAttribute("disabled", "disabled");
		var generations = 5;
		var year = 0;
		var copy = this.generateLife();
		var board = document.getElementById('board');
		var ctx = board.getContext('2d');
		this.setState({board: copy},() => {
			ctx.fillStyle = "#FF0000";
			var runGame = setInterval(()=>{
				ctx.clearRect(0,0,800,800);
				for(var i = 0; i < this.state.size[0]; i += 5) {
					for(var j = 0; j < this.state.size[1]; j += 5) {
						if(copy[i][j] === 1) ctx.fillRect(i,j,5,5);
					}
				}
				copy = this.generateLife();
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
				<canvas id='board' width='800' height='800' style={{border:"1px solid black"}}>
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