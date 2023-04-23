import { User } from './User';

export type Room = {
  id: string;
  users: User[];
  name: string;
  description: string;
};
