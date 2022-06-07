/* eslint-disable default-case */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className= {`square ${props.winningSquare ? "winning-square" : ""}`} 
        data-pro={props.value} //per cambiare colore X e O 
        onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
   
  class Board extends React.Component {
    
    renderSquare(i) {      
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          winningSquare = {this.props.winningSquares.includes(i)}
        />
      );
      
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }

  }

  class Game extends React.Component {
    constructor(props) {
      super(props);

      this.state = {

        history: [{
          squares: Array(9).fill(null)
        }],

        stepNumber: 0,
        xIsNext: true
      };
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      if (calculateWinner(squares).winner || squares[i]) {
        return;
      }

      squares[i] = this.state.xIsNext ? 'X' : 'O';

      this.setState({

        history: history.concat([{

          squares: squares, 
          location: i, //assign index

        }]),

        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
        this.setState({

            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const whoIsWinner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {

        let rigaColonna = calculateLocation(step.location);

        const desc = move ?
          `Mossa # ${move} - ${rigaColonna}` : 
          "Nuovo gioco";

        return (
            <li key={move}>
              <button className = { move === this.state.stepNumber ? "highlight" : ""}
              style = {{ textColor : "#031349", font: "15px 'Brush Script MT', cursive", borderRadius: "8px", margin: "5px", padding: "4px", backgroundColor: "#CEEAFA", border: "1px solid #031349", boxShadow: "1px 1px 3px #5b5c5c"}} 
              onClick = {() => this.jumpTo(move)}>{desc}
              </button>
            </li>
          );
      });
  
      let status;

      if (whoIsWinner.winner) {
        status = whoIsWinner.winner + ' è il vincitore!';       
      } 
      else if (!whoIsWinner.winner && (current.squares.every(X => X))) {
        status = "Pareggio!";
      }
      else {
        status = 'Turno del giocatore ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
          
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              winningSquares={whoIsWinner.whoIsWinnerLine}
            />
          </div>
          <div className="game-info">

            <div>{status}</div>
            <ol>{moves}</ol>

          </div>
        </div>
      );
    }
  }

function calculateLocation(variabile){

    switch (variabile){
      case 0:
        return 'Riga 1 Colonna 1';
      
      case 1:
        return 'Riga 1 Colonna 2';
        
      case 2:
        return 'Riga 1 Colonna 3';
       
      case 3:
        return 'Riga 2 Colonna 1';
        
      case 4:
        return 'Riga 2 Colonna 2';
        
      case 5:
        return 'Riga 2 Colonna 3';
       
      case 6:
        return 'Riga 3 Colonna 1';
        
      case 7:
        return 'Riga 3 Colonna 2';
      
      case 8:
        return 'Riga 3 Colonna 3';

      default: //necessario se arriva un caso non previsto 
        return null; 
    }

}

  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2], 
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner : squares[a],
          whoIsWinnerLine : lines[i]
        }

      } 
    }
    return {
      winner : null,
      whoIsWinnerLine : []
    }
  }

  // ========================================
//const root = ReactDOM.createRoot(document.getElementById("root"));
//root.render(<Game />);
