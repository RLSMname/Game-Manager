import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(undefined);
export const useSocketContext = () => useContext(SocketContext);
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isServerOnline, setIsServerOnline] = useState(true);

    // useEffect(() => {
    //     const socketIo = io("http://api:3000");
    //     socketIo.connect();
    //     socketIo.on("connect", () => {
    //         console.log("Socket connected");
    //         setSocket(socketIo);
    //     });

    //     return () => {
    //         socketIo.disconnect();
    //     };
    // }, []);


    // useEffect(() => {
    //     const checkServerStatus = () => {
    //         fetch('/api/misc/health-check', {
    //             method: "GET",
    //             headers: { "Content-type": "application/json; charset=UTF-8", },
    //         })
    //             .then((response) => {
    //                 // console.log("Health Check Response Status:", response.status);
    //                 // console.log(
    //                 //     "Health Check Response Status Text:",
    //                 //     response.statusText
    //                 // );
    //                 if (!response.ok) {
    //                     // console.log("Server is offline or returned an error");
    //                     //setIsServerOnline(false);
    //                 } else {
    //                     if (navigator.onLine) {
    //                         console.log("navigator.online value = ", navigator.onLine);
    //                         setIsServerOnline(true);
    //                         console.log("Server and internet are on");
    //                     }

    //                     else {
    //                         console.log("Internet is down");
    //                         //setIsServerOnline(false);
    //                     }
    //                 }
    //             })
    //             .catch((error) => {

    //                 // setIsServerOnline(false);
    //             });
    //     };
    //     checkServerStatus();

    //     const interval = 20000;
    //     const intervalId = setInterval(checkServerStatus, interval);

    //     return () => clearInterval(intervalId);
    // }, []);


    // const setOnline = () => {
    //     console.log("Internet on");
    //     setIsServerOnline(true);
    // }

    // const setOffline = () => {
    //     console.log("Internet down");
    //     setIsServerOnline(false);
    // }

    // useEffect(() => {
    //     window.addEventListener('online', setOnline);
    //     window.addEventListener('offline', setOffline);

    //     return () => {
    //         window.removeEventListener('online', setOnline);
    //         window.removeEventListener('offline', setOffline);
    //     };
    // }, []);

    const contextValue = {
        socket,
        setSocket,
        isServerOnline,
        setIsServerOnline
    }

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
}