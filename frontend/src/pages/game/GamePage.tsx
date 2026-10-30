import { useNavigate } from 'react-router';

function GamePage() {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/lobby');
  };

  return;
  <>
    <h1>Game</h1>

    <button onClick={handleExit}>Exit Game</button>
  </>;
}

export default GamePage;
