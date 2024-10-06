import { IGameState } from '../../types/game.types';

export interface ICreateGamePayload {
    maxPlayers: number;
    password?: string;
}
