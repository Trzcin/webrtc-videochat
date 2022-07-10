import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Room } from '../types/Room';
import RoomLink from './RoomLink';

interface RoomListProps {}

const RoomList: React.FC<RoomListProps> = ({}) => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    setTimeout(() => {
      fetch('http://localhost:5000/rooms')
        .then((res) => res.json())
        .then((data) => setRooms(data))
        .catch((error) => console.error(error));
    }, 500);
  }, []);

  return (
    <main className="pt-10 w-10/12 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Available Rooms</h1>
        <Link to="/newRoom" className="btn">
          Create a Room
        </Link>
      </div>

      <div className="space-y-5 mt-10">
        {rooms.map((room) => (
          <RoomLink
            key={room.id}
            name={room.name}
            description={room.description}
            userCount={room.users.length}
            id={room.id}
          />
        ))}
      </div>
    </main>
  );
};

export default RoomList;
