# Ben Tac Toe


DEV NOTES:
- i need to make tic tac toe multiplayer and online; how tf do I do this?
- i want to play tictactoe with my mom in Detroit; unfortunately she is in detroit. Luckily, she has a computer connected to the internet.
- I need a way for her to play tic tac toe via the internet.

- the tic tac toe game CANNOT just live in the browser; it is now a shared concept
- i don't want to build p2p sync engine because that sounds hard; so I am just going to store the data on a central server somewhere


### Tic Tac Toe w/ My Mom:

TODO SERVER:
1. express getting started; test with a hello world request to make sure it exists.
2. const game = createGame() // const game = initialGame() // but on the server rather than the client, so remove the client code that initializes the game.
3. app.get(/game) => res.json(game)
4. app.post(/move, req, res) => game = move(game, req.data.cellIndex); res.json(game)


TODO REACT CLIENT:







- i need to write a server

How does tic tac toe work in the first place on the client, so that I can start to make it multi-player across multiple clients?


Server Architecture:
- 
