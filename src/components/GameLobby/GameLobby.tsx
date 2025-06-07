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

function AllGamesList({ games }: { games: GameState[] }) {
    const buttonId = "view-button"
    return gamesList(games, buttonId)
}

function InProgressGamesList({ games }: { games: GameState[] }) {
    const inProgressGames = games.filter(game => !game.endState)
    const buttonId = "join-button"
    return gamesList(inProgressGames, buttonId)
}

function CompletedGamesList({ games }: { games: GameState[] }) {
    const completedGameList = games.filter(game => game.endState)
    const buttonId = "view-completed-button"
    return gamesList(completedGameList, buttonId)
}

function gamesList(games: GameState[], buttonId: string) {
    const navigate = useNavigate()
    const joinGame = (gameId: string) => {
        fetch(`${SERVER_URL}/game/${gameId}`)
            .then(res => res.json())
            .then(() => {
                navigate(`/game/${gameId}`)
            })
    }
    const buttonTag = buttonId === "view-button" || "view-completed-button" ? "View Game" : "Join Game"
    return (
        <>
            <div className="game-list">
                {games?.length === 0
                    ? <div className="no-games-message">Sorry, no games to display</div>
                    : games?.map((game) => {
                        return (
                            <div className="game-block" key={game.id}>
                                <div className="game-details">
                                    <p>ID: {game.id}</p>
                                    <p>{game.currentPlayer} is up, game is {game.endState || 'In Progress'}</p>
                                    <GameBoard board={game.board} />
                                    <button className={buttonId} onClick={() => joinGame(game.id)}>{buttonTag}</button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

function Sort() {
    return (
        <div className="sort-section">
            <p>Sorting/filtering coming soon!</p>
            {/* 
            <p>Sort by game id, alphabetical</p>
            <p>Sort by current player (x,o,n/a)</p>
            <p>sort by game state (x win, o win, tie, in progress)</p>
            <p>sort by # of moves made</p>
            <p>sort by date created/update (oldest, newest, specific date)</p> 
            */}
        </div>
    )
}


// TOP LEVEL
function GameLobby() {
    const [gameList, setGameList] = useState<GameState[]>()

    function getGameList() {
        fetch(`${SERVER_URL}/api/games`)
            .then(response => response.json())
            .then(games => setGameList(games))
    }

    useEffect(() => {
        getGameList()
    }, [])

    const navigate = useNavigate()
    const createGame = () => {
        fetch(`${SERVER_URL}/new`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(id => {
                console.log(id)
                navigate(`/game/${id}`)
            })
    }
    return (
        <div className="game-lobby-container">
            <h2 className="game-lobby-title">Game Lobby</h2>
            <button onClick={createGame}>Create New Game</button>
            <p>Choose 3x3, 2 player, 3</p>
            <h2>In-Progress Games</h2>
            {gameList && <InProgressGamesList games={gameList} />}
            <h2>Completed Games</h2>
            {gameList && <CompletedGamesList games={gameList} />}
            <h2>All Games</h2>
            {gameList && <AllGamesList games={gameList} />}
            <Sort />
        </div>
    )
}

export default GameLobby