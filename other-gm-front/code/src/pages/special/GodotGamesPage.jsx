import { Link } from "react-router-dom"

export const GodotGamesPage = () => {
    return (
        <>
            <div className='nav-div' >
                <Link className='button-style-1' to={'/games'} >Home</Link>
            </div>
            <div style={{ "width": "30%", "margin": "0 auto", "margin-top": "10%", "backgroundColor": "rgba(30, 81, 123, 0.7)", "padding": "6%", "borderRadius": "16px" }}>
                <ul>
                    <Link className='button-style-1' to={'/special/c'} >To Catch Game</Link>
                    <br></br>
                    <Link className='button-style-1' to={'/special/p'} >To Platformer Game</Link>
                    <br></br>
                    <Link className='button-style-1' to={'/special/t'} >To Tank Game</Link>
                    <br></br>
                    <Link className='button-style-1' to={'/special/s'} >To Shoot Em Up Game</Link>
                </ul>
            </div>
        </>
    )
}
