
import { GameListRenderer } from '../../components/GameListRenderer'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useState, useEffect } from 'react';
import { useDevsContext } from '../../state/context';
import { GameTile } from '../../components/GameTile';
import { Link } from 'react-router-dom';


export const InfiniteScrollMechanism = () => {
  //idea for later
  // if you still want to have add and delete, using useState, create a variable for offset and limit


  const { devs } = useDevsContext();
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const canLoadMore = () => {
    console.log("page scrolling:", page);
    console.log(" total pages scrolling:", totalPages);
    return page <= totalPages;
  }


  const activateInfiniteScroll = () => {
    const select = document.querySelector("#select-dev")
    const dev = select.value;
    console.log("DEV:", dev);


    const url = "/api/games/countGamesByDev";
    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "BEARER " + JSON.parse(localStorage.getItem("accessToken"))

        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ dev: dev })
    }).then(
      (data) => {
        if (data.ok) {
          return data.json();
        }
        else {
          throw new Error(data.message);
        }
      }
    ).then(data => {
      console.log("data count:", data.count);
      setTotalPages(Math.ceil(data.count / 10))
      console.log("total pages:", Math.ceil(data.count / 10));

    }

    ).catch(
      err => console.log("ERROR: ", err)
    );


    const url2 = "/api/games/scroll"
    console.log("DEV:", dev);
    fetch(url2, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "BEARER " + JSON.parse(localStorage.getItem("accessToken"))
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ dev: dev, page: 1 })
    }).then(
      (data) => {
        if (data.ok) {
          return data.json();
        }
        else {
          throw new Error(data.message);
        }
      }
    ).then((data) => {
      console.log("data:", data);
      setList(data);
      setPage(1);
    }
    ).catch((err) =>
      console.error("Something went wrong when loading more games:", err)
    );
  }
  const pageLoader = () => {
    // fetch page
    const url = "/api/games/scroll"
    const select = document.querySelector("#select-dev")
    const dev = select.value;
    console.log("DEV:", dev);
    setTimeout(() => {
      fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "BEARER " + JSON.parse(localStorage.getItem("accessToken"))

          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ dev: dev, page: page + 1 })
      }).then(
        (data) => {
          if (data.ok) {
            return data.json();
          }
          else {
            throw new Error(data.message);
          }
        }
      ).then((data) => {
        console.log("data:", data);
        setList(list.concat(data));
        setPage(page + 1);
      }
      ).catch((err) =>
        console.error("Somethin went wrong when loading more games:", err)
      )
    });

  }
  return (
    <>

      <button className='button-style-2' onClick={activateInfiniteScroll}>Start loading games</button>
      <br></br>
      <select id='select-dev'>
        {
          devs.map((d, i) => { return <option key={i} value={d.name}>{d.name}</option> })
        }
      </select>
      <div className='infinite-scroll-container'>
        <InfiniteScroll dataLength={list.length} next={pageLoader} hasMore={canLoadMore()} loader={<p>loading...</p>} endMessage={<p>All games have been loaded!</p>}>
          <ul>
            {list.map(
              game =>
                <li key={game.id} style={{ marginBottom: '10px' }}>
                  <div className='wrapper-card'>
                    <GameTile id={game.id} name={game.name} />
                    <div style={{ display: 'flex', alignItems: '' }} >
                      <div className='img-wrapper-tile'>
                        <img src="https://static.vecteezy.com/system/resources/previews/010/807/101/non_2x/game-control-pixel-art-free-vector.jpg"></img>
                      </div>

                    </div>
                  </div>
                </li>
            )}
          </ul>
        </InfiniteScroll>
      </div>
    </>
  )
}
