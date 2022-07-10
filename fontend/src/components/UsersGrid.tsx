import React from 'react';
import { MdGridOff } from 'react-icons/md';
import { User } from '../types/User';
import UserBox from './UserBox';

interface UsersGridProps {
  users: User[];
  userId: string;
}

const UsersGrid: React.FC<UsersGridProps> = ({ users, userId }) => {
  function columns(): string {
    if (users.length === 1) {
      return 'grid-cols-1';
    } else {
      return 'grid-cols-2';
    }
  }

  return (
    <div
      className={`grid ${columns()} auto-rows-auto w-full bg-gray-800`}
      style={{ height: 'calc(100% - 80px)' }}
    >
      {users.map((user) => (
        <UserBox key={user.id} user={user} userId={userId} />
      ))}
    </div>
  );
};

export default UsersGrid;
