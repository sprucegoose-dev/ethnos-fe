import { IPlayer } from '../Game/Game.types';

export interface IChatProps {
    className: string;
    gameId: number;
    players: IPlayer[];
}

export interface IChatMessagePayload {
    createdAt: Date;
    id: number;
    message: string;
    username: string;
}
