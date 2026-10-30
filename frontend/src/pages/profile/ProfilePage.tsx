import { useNavigate } from 'react-router';

function ProfilePage() {
  const navigate = useNavigate();

  return;
  <>
    <h1>Profile</h1>

    <button onClick={() => navigate('/deckbuilder')}>Deck Builder</button>

    <button onClick={() => navigate('/')}>Home</button>
  </>;
}

export default ProfilePage;
