import { IPlayer, IGameSettings, PlayerColor } from '../Game/Game.types';

export interface IMatchesProps {

}

export interface IMatchUser {
    id: number;
    delete: boolean;
    isBot: boolean;
    username: string;
}

export interface IMatchPlayer {
    id: number;
    color: PlayerColor;
    gameId: number;
    user: IMatchUser;
}

export interface IMatch {
    createdAt: string;
    creatorId: number;
    id: number;
    players: IMatchPlayer[];
    settings: IGameSettings;
    winnerId: number;
}

export interface IMatchesResponse {
    data: IMatch[];
    pages: number;
}
