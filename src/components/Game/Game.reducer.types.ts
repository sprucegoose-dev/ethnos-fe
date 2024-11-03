import { Color } from './Game.types';

export interface IGameReducer {
    selectedCardIds: number[];
    selectedLeaderId: number;
};

export interface ISetCardIdsAction {
    cardIds: number[];
}

export interface ISetLeaderIdAction {
    leaderId: number;
}
