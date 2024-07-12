import { useState, useEffect } from 'react';
import { useGamesContext } from '../state/contextGame'
import { GameTile } from './GameTile';
import Popup from 'reactjs-popup';
import { Link } from "react-router-dom";
import { GameAddForm } from './ui/GameAddForm';
import { GameEditForm } from './ui/GameEditForm';


export const GameListRenderer = () => {
    const { games, nextPage, prevPage, currentPage, totalPages, handleDelete, toggleSort } = useGamesContext();

    const user = JSON.parse(localStorage.getItem("user"));


    useEffect(() => {
        const refreshTokenInterval = setInterval(() => {
            const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
            console.log(refreshToken);
            fetch("/api/misc/refreshToken", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: refreshToken }),
            })
                .then((data) => {
                    if (data.ok) {
                        return data.json();

                    }
                    else {
                        console.log(data)
                        return data.json().then((errorData) => {
                            throw new Error(errorData.message); // throw an error with the error message
                        })
                    }
                }).then(data => localStorage.setItem("accessToken", JSON.stringify(data.accessToken)))
                .catch((error) => {
                    console.error("Error refreshing token:", error.message);
                    window.alert("The refresh token has expired! Please start a new session!");
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("user");
                    window.location.href = "/";
                });
        }, 30000);//30 seconds
        return () => clearInterval(refreshTokenInterval)
    }, [])

    const handleDeleteClick = (id) => {
        console.log("delete button clicked");
        handleDelete(id);
    };


    const [editGameId, setEditGameId] = useState(null);

    const handleEditClick = (id) => {
        console.log("edit button clicked");
        setEditGameId(id);
    };

    const handleCloseEdit = () => {
        console.log("close edit modal");
        setEditGameId(null);
    };


    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleAddClick = () => {
        console.log("add button clicked");
        setIsAddModalOpen(true);
    };

    const handleCloseAdd = () => {
        console.log("close add modal");
        setIsAddModalOpen(false);
    };




    return (
        <>
            <br></br>
            <br></br>
            <button id="sort-button" className='button-style-2' onClick={() => toggleSort()}>Toggle Sort</button>
            <div className='infinite-scroll-container'>

                <h2>Games</h2>
                <h3>Page: {currentPage}/{totalPages}</h3>
                <button className='button-style-1' onClick={handleAddClick}>Add Game</button>
                <ul>
                    {games.map(
                        game =>
                            <li style={{ marginBottom: '10px' }} key={game.id}>
                                <div className='wrapper-card'>
                                    <GameTile id={game.id} name={game.name} />
                                    <div style={{ display: 'flex', alignItems: '' }} >
                                        <div className='img-wrapper-tile'>
                                            <img src="/controller.jpg" alt="Game Control Pixel Art"></img>
                                        </div>
                                        <div className='btn-wrapper-list'>
                                            <button className='button-style-1' onClick={() => handleEditClick(game.id)}>Edit</button>
                                            <button className='button-style-1' onClick={() => handleDeleteClick(game.id)}>Delete</button>
                                            <Link className='button-style-1' target="_blank" to={{ pathname: `/${game.id}` }} state={{ id: game.id }}>View</Link>
                                        </div>
                                    </div>
                                </div>
                            </li>
                    )}

                </ul>


                <Popup open={editGameId !== null} onClose={handleCloseEdit}>
                    <div className='popup'>
                        <h2>Edit Game</h2>
                        <GameEditForm
                            gameId={editGameId}
                            initialData={games.find(game => game.id === editGameId)}
                            onClose={handleCloseEdit}
                        />
                    </div>
                </Popup>

                <Popup open={isAddModalOpen} onClose={handleCloseAdd}>
                    <div className='popup'>
                        <h2>Add Game</h2>
                        <GameAddForm onClose={handleCloseAdd} />
                    </div>
                </Popup>
                {currentPage > 1 && <button className='button-style-2' onClick={prevPage}>Prev</button>}
                {currentPage < totalPages && <button className='button-style-2' onClick={nextPage}>Next</button>}

            </div>
        </>
    )
}
