import { MediaConnection } from 'peerjs';

export type User = {
  id: string;
  name: string;
  peer: MediaConnection | undefined;
  stream: MediaStream | undefined;
  videoEnabled: boolean;
};
