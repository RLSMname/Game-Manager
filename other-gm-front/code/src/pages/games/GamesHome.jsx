import { GamesProvider, useGamesContext } from '../../state/contextGame'
import { GameListRenderer } from '../../components/GameListRenderer'
import { Link } from 'react-router-dom'
import { Logout } from '../../components/Logout'
import { useNavigate, Navigate } from 'react-router-dom';
export const GamesHome = () => {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/" replace></Navigate>
  }
  return (

    <GamesProvider>
      <Logout></Logout>
      <div className='nav-div' >
        <Link className='button-style-1' to="/games-scrolling">To Scroll</Link>
        <br></br>
        <Link className='button-style-1' to="/pie">Diagram</Link>
        <br></br>
        <Link className='button-style-1' to="/devs">Developers</Link>
      </div>
      <GameListRenderer />
    </GamesProvider>
  )
}
