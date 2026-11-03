import { Route, Routes } from 'react-router';

import DeckbuilderPage from '@/pages/deckbuilder/DeckbuilderPage';
import GamePage from '@/pages/game/GamePage';
import HomePage from '@/pages/home/HomePage';
import LobbyPage from '@/pages/lobby/LobbyPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import UpdateDeckPage from '@/pages/update-deck/UpdateDeckPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/deckbuilder" element={<DeckbuilderPage />} />
      <Route path="/update-deck" element={<UpdateDeckPage />} />
      <Route path="/lobby" element={<LobbyPage />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>
  );
}
