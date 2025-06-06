
const environment = process.env.ENVIRONMENT ?? "development"
export const PORT = 3000
export const SERVER_URL = (environment === "production") ?
    "http://tictactoe-main-rupfn.kinsta.app" : `http://localhost:${PORT}`