import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const SetupForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const history = useHistory();

  const saveUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    sessionStorage.setItem('username', username);
    history.push('/rooms');
  };

  useEffect(() => {
    if (sessionStorage.getItem('username')) {
      history.push('rooms');
    }
  }, []);

  return (
    <main className="pt-10 w-10/12 max-w-xl mx-auto">
      <div className="bg-gray-800 w-full mx-auto rounded-md shadow-lg py-10">
        <form className="w-2/3 max-w-xs mx-auto" onSubmit={saveUsername}>
          <h1 className="text-center font-semibold text-2xl">WebRTC Chat</h1>

          <label htmlFor="username" className="inline-block mt-5">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button type="submit" className="btn mt-8 w-full">
            Browse Rooms
          </button>
        </form>
      </div>
    </main>
  );
};

export default SetupForm;
