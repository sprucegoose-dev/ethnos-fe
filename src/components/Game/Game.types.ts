
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

export enum GameState {
    CANCELLED = 'cancelled',
    CREATED = 'created',
    ENDED = 'ended',
    STARTED = 'started',
}

export interface IGameSettings {
    tribes: TribeName[];
}

export enum CardState {
    IN_MARKET = 'in_market',
    IN_DECK = 'in_deck',
    IN_HAND = 'in_hand',
    IN_BAND = 'in_band',
    REVEALED = 'revealed',
}

export interface ITribe {
    id: number;
    name: TribeName;
    description: string;
}

export interface IUser {
    id: number;
    username: string;
}

export interface IPlayer {
    id: number;
    userId: number;
    gameId: number;
    giantTokenValue: number;
    orcTokens: Color[];
    trollTokens: number[];
    merfolkTrackScore: number;
    user: IUser;
}

export interface ICard {
    id: number;
    state: CardState;
    color: Color;
    tribeId: number;
    leaderId: number;
    gameId: number;
    playerId: number;
    index: number;
    tribe: ITribe;
}

export interface IGameState {
    id: number;
    activePlayerId: number;
    winnerId: number;
    state: GameState;
    maxPlayers: number;
    turnOrder: number[];
    age: number;
    settings: IGameSettings;
    createdAt: string;
    updatedAt: string;
    creatorId: number;
    creator: IUser;
    cards: ICard[];
    players: IPlayer[];
}

export interface IActiveGame extends IGameState {
    hasPassword: boolean;
}
