import { Link } from 'react-router';

function HomePage() {
  return (
    <>
      <h1>Home</h1>
      {/* Profile 이동 */}
      <Link to="/profile">Profile</Link>

      {/* Lobby 이동 */}
      <Link to="/lobby">Profile</Link>
    </>
  );
}

export default HomePage;
