import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Logout = () => {
    const navigate = useNavigate();

    const handleLogOut = () => {
        const user = localStorage.getItem("user");
        const refreshToken = localStorage.getItem("refreshToken");
        const url = "/api/misc/logout";
        fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                token: refreshToken
            })
        })
            .then(res => {
                if (!res.ok) {
                    console.log(res)
                    return res.json().then((errorData) => {
                        throw new Error(errorData);
                    });
                }
                return res.json();
            })
            .then(() => {
                removeUserFromLocalStorage();
                navigate("/");
            }
            )
    }

    const removeUserFromLocalStorage = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
    }

    return (
        <div>
            <button className='logout-button' onClick={handleLogOut}>LogOut</button>
        </div>
    )
}
