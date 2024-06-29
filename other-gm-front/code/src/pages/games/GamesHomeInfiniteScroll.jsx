
import { DevsProvider, useDevsContext } from "../../state/context"
import { InfiniteScrollMechanism } from "./InfiniteScrollMechanism"
import { GamesProvider } from "../../state/contextGame"
import { Link } from 'react-router-dom'
import { useNavigate, Navigate } from 'react-router-dom';

export const GamesHomeInfiniteScroll = () => {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/" replace></Navigate>
  }
  return (
    <DevsProvider>
      <div className="nav-div" >
        <Link className="button-style-1" to="/games">Back</Link>
        <br></br>
        <Link className="button-style-1" to="/pie">Diagram</Link>
      </div>
      <br></br>
      <InfiniteScrollMechanism />
    </DevsProvider>
  )
}
