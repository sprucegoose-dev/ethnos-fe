import { Color } from './Game.types';

export enum ActionType {
    ADD_FREE_TOKEN = 'add_free_token',
    DRAW_CARD = 'draw_card',
    KEEP_CARDS = 'keep_cards',
    PICK_UP_CARD = 'pick_up_card',
    PLAY_BAND = 'play_band',
}

export interface IActionPayloadBase {
    cardIds?: number[];
    type: ActionType.DRAW_CARD | ActionType.KEEP_CARDS;
}

export interface IPickUpCardPayload {
    cardId: number;
    type: ActionType.PICK_UP_CARD;
}

export interface IAddFreeTokenPayload {
    nextActionId: number;
    regionColor: Color;
    type: ActionType.ADD_FREE_TOKEN;
}

export interface IPlayBandPayload {
    cardIds?: number[];
    cardIdsToKeep?: number[];
    leaderId: number;
    nextActionId?: number;
    regionColor?: Color;
    type: ActionType.PLAY_BAND;
}

export type IActionPayload =
    IActionPayloadBase |
    IPlayBandPayload |
    IPickUpCardPayload |
    IAddFreeTokenPayload;

export interface INextActionPayload {
    type: ActionType;
}

export interface IActionRequest {
    body: IActionPayloadBase;
}
