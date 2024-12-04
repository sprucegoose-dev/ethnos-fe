import { ICard, PlayerColor } from '../Game/Game.types';

export interface IActionLogPayload {
    card: ICard;
    cardIds: number[];
    id: number,
    label: string,
    leaderId: number,
    playerColor: PlayerColor,
}

export interface IActionsLogProps {
    gameId: number;
    actionsLog: IActionLogPayload[];
}

