import { Socket } from 'socket.io';

export interface CustomSocket extends Socket {
  user: {
    id: string;
    [key: string]: any;
  };
}
