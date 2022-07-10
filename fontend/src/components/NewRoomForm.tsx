import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Room } from '../types/Room';

const NewRoomForm: React.FC = ({}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const history = useHistory();

  function createRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    fetch('http://localhost:5000/newRoom', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((room: Room) => {
        history.push(`/room/${room.id}`);
      })
      .catch((error) => console.error(error));
  }

  return (
    <main className="pt-10 w-10/12 max-w-xl mx-auto">
      <div className="bg-gray-800 w-full mx-auto rounded-md shadow-lg py-10">
        <form className="w-2/3 max-w-xs mx-auto" onSubmit={createRoom}>
          <h1 className="text-center font-semibold text-2xl">Create Room</h1>

          <label htmlFor="name" className="inline-block mt-5">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="description" className="inline-block mt-5">
            Description
          </label>
          <input
            type="text"
            name="description"
            id="description"
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit" className="btn mt-8 w-full">
            Create Room
          </button>
        </form>
      </div>
    </main>
  );
};

export default NewRoomForm;
