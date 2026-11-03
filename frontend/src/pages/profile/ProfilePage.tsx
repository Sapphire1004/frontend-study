import { useNavigate } from 'react-router';

import { useAuthStore } from '@/store/authStore';

function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Profile</h1>

      <div className="space-y-4">
        {/* 공통 버튼이나 레이아웃은 여기에 한 번만 작성 */}

        {!isLoggedIn || user === null ? (
          <h1>Not logged in</h1>
        ) : (
          <>
            <h1>Profile</h1>

            <p>ID: {user.id}</p>
            <p>Nickname: {user.nickname}</p>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="cursor-pointer rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={handleLogout}
        >
          Logout
        </button>

        <button
          className="cursor-pointer rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => navigate('/deckbuilder')}
        >
          Deck Builder
        </button>

        <button
          className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100"
          onClick={() => navigate('/')}
        >
          Home
        </button>
      </div>
    </>
  );
}

export default ProfilePage;
