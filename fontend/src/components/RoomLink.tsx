import React from 'react';
import { Link } from 'react-router-dom';

interface RoomLinkProps {
  name: string;
  description: string;
  userCount: number;
  id: string;
}

const RoomLink: React.FC<RoomLinkProps> = ({
  name,
  description,
  userCount,
  id,
}) => {
  return (
    <div className="bg-gray-800 h-48 w-full rounded-md flex justify-between py-5 px-4">
      <div className="col-span-3">
        <h2 className="text-white font-semibold text-2xl">{name}</h2>
        <p className="mt-2 text-sm">{description}</p>
      </div>
      <div className="col-span-1">
        <h3 className="text-base font-medium">{userCount} users active</h3>
        <Link to={`/room/${id}`} className="btn">
          Join Room
        </Link>
      </div>
    </div>
  );
};

export default RoomLink;
