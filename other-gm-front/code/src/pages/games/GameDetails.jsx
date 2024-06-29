import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GameCard } from "../../components/GameCard";
export const GameDetails = () => {

    //let {state}=useLocation();
    //const id = state.id;
    const { id } = useParams();
    const [item, setItem] = useState({ name: "", developer: "", description: "", price: 0 });

    useEffect(() => {
        fetch(`/api/games/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Authorization": "BEARER " + JSON.parse(localStorage.getItem("accessToken"))

                }
            })
            .then(response => response.json())
            .then(data => {
                const newItem = {
                    name: data.name,
                    developer: data.developer.name,
                    price: data.price,
                    description: data.description
                }
                setItem(newItem);
            });
    }, [id]);
    return (
        <div style={{
            width: `100vw`, height:
                '100vh', display:
                'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <GameCard name={item.name} developer={item.developer} description={item.description} price={item.price} />
        </div>
    )
}
