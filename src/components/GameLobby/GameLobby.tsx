import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { type GameState } from '../../game/game.ts'
import './GameLobby.css'
import { SERVER_URL } from '../../utils/constants.ts'

function GameBoard({ board }: { board: GameState['board'] }) {
    return (
        <div className="game-board-preview">
            {board.map((cell, index) => (
                <div key={index} className="board-cell">
                    {cell || ''}
                </div>
            ))}
        </div>
    )
}

function GameList({ gameList }: { gameList: GameState[] }) {
    const navigate = useNavigate()

    const joinGame = (gameId: string) => {
        fetch(`${SERVER_URL}/game/${gameId}`)
            .then(res => res.json())
            .then(() => {
                navigate(`/game/${gameId}`)
            })
    }

    return (
        <div className="game-list">
            {gameList?.length === 0
                ? <div className="no-games-message">Sorry, no games to display</div>
                : gameList?.map((game) => {
                    return (
                        <div className="game-block" key={game.id}>
                            <h4>Game ID: {game.id}</h4>
                            <div className="game-details">
                                <p>Current Player: {game.currentPlayer}</p>
                                <p>Game State: {game.endState || 'In Progress'}</p>
                                <GameBoard board={game.board} />
                                <button className="join-button" onClick={() => joinGame(game.id)}>Join Game</button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

function Sort() {
    return (
        <div className="sort-section">
            <p>Hey, you'll be able to sort your games here eventually</p>
        </div>
    )
}

function GameLobby() {
    const [gameList, setGameList] = useState<GameState[]>()

    function getGameList() {
        fetch(`${SERVER_URL}/game/all`)
            .then(response => response.json())
            .then(games => setGameList(games))
    }

    useEffect(() => {
        getGameList()
    }, [])

    return (
        <div className="game-lobby-container">
            <h2 className="game-lobby-title">Game Lobby</h2>
            <Sort />
            {gameList && <GameList gameList={gameList} />}
        </div>
    )
}

export default GameLobby