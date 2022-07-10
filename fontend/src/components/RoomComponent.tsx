import React, { useEffect, useState } from 'react';
import { MdSettings } from 'react-icons/md';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { RiCameraFill, RiCameraOffFill } from 'react-icons/ri';
import UsersGrid from './UsersGrid';
import { Link, useHistory, useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { User } from '../types/User';
import Peer, { MediaConnection } from 'peerjs';

const RoomComponent: React.FC = () => {
  const [muted, setMuted] = useState(true);
  const [cameraOff, setCameraOff] = useState(true);
  const [roomName, setRoomName] = useState('Room');
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState('');
  const [socketState, setSocketState] = useState<Socket>();

  const history = useHistory();

  //@ts-ignore
  const { roomId } = useParams();

  //add video, audio mute
  useEffect(() => {
    setUsers((prev) => {
      const newVal = [...prev];
      const i = newVal.findIndex((val) => val.id === userId);
      if (newVal[i] && newVal[i].stream) {
        newVal[i].stream!.getAudioTracks()[0].enabled = !muted;
        return newVal;
      } else {
        return prev;
      }
    });
  }, [muted, userId, socketState]);

  useEffect(() => {
    setUsers((prev) => {
      const newVal = [...prev];
      const i = newVal.findIndex((val) => val.id === userId);
      if (newVal[i] && newVal[i].stream) {
        newVal[i].stream!.getVideoTracks()[0].enabled = !cameraOff;

        newVal[i].videoEnabled = !cameraOff;

        //let other lads know
        if (socketState) {
          socketState.emit('video-change', !cameraOff);
        }

        return newVal;
      } else {
        return prev;
      }
    });
  }, [cameraOff, userId, socketState]);

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    const socket = io('ws://localhost:5000');
    setSocketState(socket);
    let peer: Peer;
    let stream: MediaStream;

    socket.on('connect', () => {
      setUserId(socket.id);
      peer = new Peer(socket.id, {
        host: 'localhost',
        port: 5000,
        path: '/peerjs',
      });

      //enable audio and video
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((mediaStream) => {
          stream = mediaStream;
          //turn audio and video off by default
          stream.getAudioTracks()[0].enabled = false;
          stream.getVideoTracks()[0].enabled = false;

          peer.on('call', (call) => {
            console.log(`${call.peer} is calling`);
            call.answer(stream);
            answerCall(call);
          });

          socket.on('user-connected', (user: User) => {
            setUsers((prev) => [
              ...prev,
              {
                ...user,
                peer: undefined,
                stream: undefined,
                videoEnabled: false,
              },
            ]);
            const call = peer.call(user.id, stream);
            answerCall(call);
          });

          socket.on('init', (name: string, users: User[]) => {
            console.log('init');
            setRoomName(name);

            const fullUsers: User[] = users.map((user) => {
              return {
                id: user.id,
                name: user.name,
                peer: undefined,
                stream: user.id === socket.id ? stream : undefined,
                videoEnabled: false,
              };
            });
            setUsers(fullUsers);

            for (let user of fullUsers) {
              if (user.id === socket.id) {
                continue;
              }
              const call = peer.call(user.id, stream);
              answerCall(call);
            }
          });

          function answerCall(call: MediaConnection) {
            call.on('stream', (userVideoStream) => {
              setUsers((prev) =>
                prev.map((val) => {
                  if (val.id === call.peer)
                    return { ...val, stream: userVideoStream };
                  else return val;
                })
              );
            });

            call.on('close', () => {
              setUsers((prev) =>
                prev.map((val) => {
                  if (val.id === call.peer)
                    return { ...val, stream: undefined };
                  else return val;
                })
              );
            });
          }

          //start things off
          socket.emit('join-room', roomId, username);
        });
    });

    socket.on('invalid-id', () => {
      history.push('/rooms');
    });

    socket.on('video-changed', (id: string, enabled: boolean) => {
      setUsers((prev) =>
        prev.map((val) => {
          if (val.id === id) {
            return { ...val, videoEnabled: enabled };
          } else {
            return val;
          }
        })
      );
    });

    socket.on('user-disconnected', (user: User) => {
      setUsers((prev) => prev.filter((val) => val.id !== user.id));
    });

    return () => {
      socket.close();
      peer.disconnect();

      stream.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);
  const switchMic = () => setMuted((prev) => !prev);
  const switchCam = () => setCameraOff((prev) => !prev);

  return (
    <main className="w-full h-full">
      <nav className="flex items-center w-full justify-center h-20 relative">
        <h1 className="text-xl font-semibold">{roomName}</h1>
        <div className="items-center self absolute right-3">
          <button className="focus:outline-none">
            <MdSettings size={22} className="hover:text-gray-300" />
          </button>
          <button
            className="inline-block ml-5 focus:outline-none"
            onClick={switchMic}
          >
            {!muted ? (
              <FaMicrophone size={22} className="hover:text-gray-300" />
            ) : (
              <FaMicrophoneSlash size={22} className="hover:text-gray-300" />
            )}
          </button>
          <button
            className="inline-block ml-5 focus:outline-none"
            onClick={switchCam}
          >
            {!cameraOff ? (
              <RiCameraFill size={22} className="hover:text-gray-300" />
            ) : (
              <RiCameraOffFill size={22} className="hover:text-gray-300" />
            )}
          </button>
          <Link to="/rooms" className="btn inline-block ml-8">
            Leave Room
          </Link>
        </div>
      </nav>

      <UsersGrid users={users} userId={userId} />
    </main>
  );
};

export default RoomComponent;
