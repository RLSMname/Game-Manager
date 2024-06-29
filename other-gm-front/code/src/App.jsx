import './App.css'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { DevsHome } from './pages/devs/DevsHome';
import { GameDetails } from './pages/games/GameDetails';
import { GamesHome } from './pages/games/GamesHome';
import { SocketProvider } from './state/sockets';
import { AuthForm } from './pages/auth/AuthForm';
import AuthProvider from 'react-auth-kit';
import createStore from 'react-auth-kit/createStore';
import { GamesHomeInfiniteScroll } from './pages/games/GamesHomeInfiniteScroll';

import { ChartPage } from './pages/ChartPage';

function App() {
  const store = createStore({
    authName: '_auth',
    authType: 'cookie',
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === 'https:',
  });

  return (
    <>
      <AuthProvider store={store}>
        <BrowserRouter>
          <SocketProvider>
            <Routes>
              <Route path="/" element={<AuthForm />} />
              <Route path="/games" element={<GamesHome />} />
              <Route path="/games-scrolling" element={<GamesHomeInfiniteScroll />} />
              {/* <Route path="/" element={<GamesHome/>} /> */}
              <Route path="/devs" element={<DevsHome />} />
              <Route path="/:id" element={<GameDetails />} />
              <Route path="/pie" element={

                < ChartPage></ChartPage>}>
              </Route>

            </Routes>
          </SocketProvider>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
