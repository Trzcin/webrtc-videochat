import React, { useLayoutEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { User } from '../types/User';

interface UserBoxProps {
  user: User;
  userId: string;
}

const UserBox: React.FC<UserBoxProps> = ({ user, userId }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    if (!videoRef.current || !user.stream || videoRef.current.srcObject) {
      return;
    }
    console.log('stream is there');
    videoRef.current.srcObject = user.stream;
  }, [user]);

  return (
    <div className="relative">
      <div
        className="flex items-center justify-center w-full h-full"
        style={{ height: 'calc(100% - 80px)' }}
      >
        <FaUserCircle size="50%" />
        <span className="absolute left-7 bottom-7 font-medium text-2xl z-10">
          {user.name}
        </span>

        {/* video */}
        {user.stream !== undefined ? (
          <video
            ref={videoRef}
            muted={user.id === userId}
            onCanPlay={() => videoRef.current!.play()}
            className={`w-full h-full object-cover absolute inset-0 ${
              !user.videoEnabled ? 'hidden' : ''
            }`}
          ></video>
        ) : null}
      </div>
    </div>
  );
};

export default UserBox;
