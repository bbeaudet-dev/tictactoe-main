import { useState, useEffect } from 'react'
import { SERVER_URL } from '../../db/db.ts'
import { type GameState } from '../../game/game.ts'
import './GameLobby.css'

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

    const joinGame = (gameId: string) => {
        fetch(`${SERVER_URL}/game/${gameId}`)
            .then(res => res.json())
        // .then(res => GO_TO_NEW_URL(res))
    }

    return (
        <>
            <h2>Game Lobby</h2>
            <Sort />
            <GameList />
        </>
    )

    function GameList() {
        return (
            <>
                {gameList === null
                    ? <div>Sorry, no games to display</div>
                    : gameList.map((game) => {
                        return (
                            <div>
                                <h4>Game ID: {game.id}</h4>
                                <p>Current Player: {game.currentPlayer}</p>
                                <p>Game State: {game.endState}</p>
                                <p>Board: {game.board}</p>
                                <button onClick={() => joinGame(game.id)}>Join Game</button>
                            </div>
                        )
                    })
                }
            </>
        )
    }

    function Sort() {
        return (
            <>
                <p>Hey, you'll be able to sort your games here eventually</p>
            </>
        )
    }

}

export default GameLobby