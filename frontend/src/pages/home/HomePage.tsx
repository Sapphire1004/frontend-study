import { Link } from 'react-router';

import { useAuthStore } from '@/store/authStore';

function HomePage() {
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    login({
      id: 1,
      nickname: 'Reliya',
    });
    console.log('user =', useAuthStore.getState().user);
  };
  return (
    <main className="space-y-4 p-6">
      <h1 className="text-2xl font-bold">Home</h1>

      <div className="flex flex-wrap gap-3">
        <button
          className="cursor-pointer rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={handleLogin}
        >
          Login
        </button>

        {/* Profile 이동 */}
        <Link
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100"
          to="/profile"
        >
          Profile
        </Link>

        {/* Lobby 이동 */}
        <Link
          className="rounded-md border border-green-600 bg-green-50 px-4 py-2 text-green-700 hover:bg-green-100"
          to="/lobby"
        >
          Lobby
        </Link>
      </div>
    </main>
  );
}

export default HomePage;
