import { useEffect, useState } from 'react'
import './App.css'
import { initialGameState, move, type CellIndex, type Game } from './game/game'


const SERVER_URL = 'http://localhost:3000'


function App() {
  // client shouldn't be allowed to initialize its own game, again it needs to ask the server for the game
  const [game, setGame] = useState<Game | null>(null)
  const isLoading = !game

  function getAllGames() {
    fetch(`${SERVER_URL}/game/all`)
      .then(response => response.json())
      .then(games => console.log(games))
  }

  function getGame() {
    fetch(`${SERVER_URL}/game`)
      .then(response => response.json())
      .then(newGame => setGame(newGame))
  }

  useEffect(() => {
    getGame()
  }, [])

  const cellClick = (cellIndex: CellIndex) => {
    if (game?.endState) return

    fetch(`${SERVER_URL}/move`, {
      method: "POST",
      body: JSON.stringify({ cellIndex: cellIndex, gameId: game?.id }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => setGame(res))
  }

  function GameBoard() {
    return (
      <div className="game-board">
        {isLoading && "Loading..."}
        {!isLoading && <>
          <div className="board-row">
            <div onClick={() => cellClick(0)} className={`cell ${game.board[0]?.toLowerCase() || ''}`} >{game.board[0]}</div>
            <div onClick={() => cellClick(1)} className={`cell ${game.board[1]?.toLowerCase() || ''}`} >{game.board[1]}</div>
            <div onClick={() => cellClick(2)} className={`cell ${game.board[2]?.toLowerCase() || ''}`} >{game.board[2]}</div>
          </div>
          <div className="board-row">
            <div onClick={() => cellClick(3)} className={`cell ${game.board[3]?.toLowerCase() || ''}`} >{game.board[3]}</div>
            <div onClick={() => cellClick(4)} className={`cell ${game.board[4]?.toLowerCase() || ''}`} >{game.board[4]}</div>
            <div onClick={() => cellClick(5)} className={`cell ${game.board[5]?.toLowerCase() || ''}`} >{game.board[5]}</div>
          </div>
          <div className="board-row">
            <div onClick={() => cellClick(6)} className={`cell ${game.board[6]?.toLowerCase() || ''}`} >{game.board[6]}</div>
            <div onClick={() => cellClick(7)} className={`cell ${game.board[7]?.toLowerCase() || ''}`} >{game.board[7]}</div>
            <div onClick={() => cellClick(8)} className={`cell ${game.board[8]?.toLowerCase() || ''}`} >{game.board[8]}</div>
          </div>
        </>}
      </div >
    )
  }


  return (
    <div className="application">
      <h1>Tic-Tac-Toe</h1>
      <GameBoard />
      {game?.endState && <div>{game.endState}</div>}
      <p>Current game ID: {game?.id}</p>
    </div>
  )
}

export default App
