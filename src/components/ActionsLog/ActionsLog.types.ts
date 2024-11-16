import { ICard, PlayerColor } from '../Game/Game.types';

export interface IActionLogPayload {
    card: ICard;
    id: number,
    label: string,
    leaderId: number,
    playerColor: PlayerColor,
}

export interface IActionsLogProps {
    actionsLog: IActionLogPayload[];
    cards: ICard[];
}

