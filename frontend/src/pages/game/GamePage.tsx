import { useNavigate } from 'react-router';

function GamePage() {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/lobby');
  };

  return;
  <>
    <h1 className="mb-4 text-2xl font-bold">Game</h1>

    <button
      className="cursor-pointer rounded-md border border-red-600 bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      onClick={handleExit}
    >
      Exit Game
    </button>
  </>;
}

export default GamePage;
