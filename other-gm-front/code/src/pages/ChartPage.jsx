
import { GamesProvider } from '../state/contextGame'
import { Logout } from '../components/Logout'
import { Link, Navigate } from 'react-router-dom'
import Pie from './Pie'
Navigate
export const ChartPage = () => {
    const user = localStorage.getItem("user");
    if (!user) {
        return <Navigate to="/" replace></Navigate>
    }
    return (
        <GamesProvider>

            <Logout></Logout>
            <Link style={{ padding: '10px' }} className='button-style-2' to="/games">Back</Link>
            <Pie></Pie>
        </GamesProvider>
    )
}
