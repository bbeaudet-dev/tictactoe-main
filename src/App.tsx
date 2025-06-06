import './App.css'
import { Outlet } from 'react-router'


function App() {

  return (
    <div className="application">
      <h1>Tic-Tac-Toe</h1>
      <Outlet />
    </div>
  )
}

export default App
