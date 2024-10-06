
export enum Color {
    BLUE = 'blue',
    GRAY = 'gray',
    GREEN = 'green',
    ORANGE = 'orange',
    PURPLE = 'purple',
    RED = 'red',
}

export enum TribeName {
    CENTAUR = 'Centaur',
    DWARF = 'Dwarf',
    DRAGON = 'Dragon',
    ELF = 'Elf',
    GIANT = 'Giant',
    HALFLING = 'Halfling',
    MERFOLK = 'Merfolk',
    MINOTAUR = 'Minotaur',
    ORC = 'Orc',
    SKELETON = 'Skeleton',
    TROLL = 'Troll',
    WINGFOLK = 'Wingfolk',
    WIZARD = 'Wizard',
}

export enum ActionType {
    DRAW_CARD = 'draw_card',
    PICK_UP_CARD = 'pick_up_card',
    PLAY_BAND = 'play_band',
    KEEP_CARDS = 'keep_cards',
    ADD_FREE_TOKEN = 'add_free_token'
}

export interface IActionPayloadBase {
    cardIds?: number[];
    type: ActionType.DRAW_CARD |
        ActionType.KEEP_CARDS;
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
    nextActionId?: number;
    cardIds?: number[];
    cardIdsToKeep?: number[];
    leaderId: number;
    regionColor?: Color;
    type: ActionType.PLAY_BAND;
}

export type IActionPayload = IActionPayloadBase |
    IPlayBandPayload |
    IPickUpCardPayload |
    IAddFreeTokenPayload;

export interface INextActionPayload {
    type: ActionType;
}

export interface IActionRequest {
    body: IActionPayloadBase;
}

export interface IBandDetails {
    color: Color;
    tribe: TribeName;
    bandSize: number;
}
