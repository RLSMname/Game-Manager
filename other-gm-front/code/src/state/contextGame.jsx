/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useSocketContext } from "./sockets";
import { storeAction } from "../utils/games/localStorageUtils";
import { removeActionFromStorage } from "../utils/games/localStorageUtils";
const PAGE_SIZE = 5;

export const GamesContext = createContext(undefined);
export const useGamesContext = () => useContext(GamesContext);

// move some of the api calls somewhere else
export const GamesProvider = ({ children }) => {
    const [games, setGames] = useState([]);
    const [allGames, setAllGames] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const { isServerOnline, setIsServerOnline } = useSocketContext();
    const [sortOrder, setSortOrder] = useState("asc");//true for increasing. false for decreasing


    useEffect(() => {
        fetchGames(1);
        fetchAllGames();
    }, []);

    const toggleSort = () => {
        if (sortOrder === "asc") setSortOrder("desc");
        else setSortOrder("asc");
        setCurrentPage(1);
        fetchGames(1);
    }

    const getToken = () => {
        let accessToken = localStorage.getItem("accessToken");
        if (accessToken === undefined) {
            throw new Error("Token no longer valid");
        }
        return accessToken;
    }

    const fetchGames = async (page = currentPage) => {
        try {
            const response = await fetch(`/api/games/pages/${page}?sortOrder=${sortOrder}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": "BEARER " + JSON.parse(localStorage.getItem("accessToken"))

                }
            });

            const { games, totalCount } = await response.json();
            console.log("games:", games)
            setGames(games);
            setTotalCount(totalCount);
            setTotalPages(Math.ceil(totalCount / PAGE_SIZE));
        } catch (error) {
            console.error("Error fetching games:", error);
            setIsServerOnline(false);
        }
    };

    const fetchAllGames = async () => {
        try {
            const response = await fetch(`/api/games/all`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": "BEARER " + JSON.parse(localStorage.getItem("accessToken"))

                }
            });

            const allGames = await response.json();
            console.log("games:", allGames)
            setAllGames(allGames);
        } catch (error) {
            console.error("Error fetching games:", error);
            setIsServerOnline(false);
        }
    }

    const nextPage = async () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            await fetchGames(currentPage + 1);
        }
    };

    const prevPage = async () => {

        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            await fetchGames(currentPage - 1);
        }
    };

    const handleAdd = async (game) => {
        try {
            const response = await fetch("/api/games/add", {
                method: "POST",
                body: JSON.stringify(game),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": "BEARER " + JSON.parse(localStorage.getItem("accessToken"))

                }
            });
            if (!response.ok) {
                throw new Error("Failed to add game");
            }
            setTotalCount(totalCount + 1);
            setTotalPages(Math.ceil((totalCount + 1) / PAGE_SIZE));
            fetchGames(currentPage);
        } catch (error) {
            console.error("Error adding game:", error);
            setIsServerOnline(false);
            storeAction("add", game); // Store action in local storage
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/games/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": "BEARER " + JSON.parse(localStorage.getItem("accessToken"))

                }


            });
            if (!response.ok) {
                throw new Error("Failed to delete game");
            }
            setTotalCount(totalCount - 1);

            if (games.length === 1) {
                if (currentPage > 1) {
                    fetchGames(currentPage - 1);
                } else {
                    setGames([]);
                }
                setCurrentPage(currentPage - 1);
                setTotalPages(totalPages - 1);
            } else {
                fetchGames(currentPage);
            }
        } catch (error) {
            console.error("Error deleting game:", error);
            //setIsServerOnline(false);
            storeAction("delete", id);
        }
    };


    const handleEdit = async (id, updatedData) => {
        try {
            const response = await fetch(`/api/games/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    name: updatedData.name,
                    developer: updatedData.developer,
                    price: updatedData.price,
                    description: updatedData.description
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": "BEARER " + JSON.parse(localStorage.getItem("accessToken"))

                }
            });
            if (!response.ok) {
                throw new Error("Failed to edit game");
            }
            const formattedUpdatedData = { ...updatedData, developer: { name: updatedData.developer } };
            setGames(prevGames =>
                prevGames.map(game =>
                    game.id === id ? { ...game, ...formattedUpdatedData } : game
                )
            );
        } catch (error) {
            console.error("Error editing game:", error);
            //setIsServerOnline(false);
            storeAction("edit", { id, updatedData });
        }
    };


    const processOfflineActions = async () => {
        const storedActions = JSON.parse(localStorage.getItem("storedActions")) || []
        console.log("CURRENT OFFLINE ACTIONS:", storedActions);
        for (const action of storedActions) {
            console.log("CURRENT ACTION: ", action);
            switch (action.action) {
                case "add":
                    await handleAdd(action.data);
                    break;
                case "delete":
                    await handleDelete(action.data);
                    break;
                case "edit":
                    await handleEdit(action.data.id, action.data.updatedData);
                    break;
            }
            removeActionFromStorage(action.action, action.data);
        }
    };

    useEffect(() => {
        if (isServerOnline && navigator.onLine) {
            fetchGames(1);
            processOfflineActions();
        }
    }, [isServerOnline]);


    const contextValue = {
        games,
        currentPage,
        totalPages,
        totalCount,
        fetchGames,
        nextPage,
        prevPage,
        handleDelete,
        handleAdd,
        handleEdit,
        toggleSort,
        sortOrder,
        allGames
    };

    return (
        <GamesContext.Provider value={contextValue}>
            {children}
        </GamesContext.Provider>
    );
}