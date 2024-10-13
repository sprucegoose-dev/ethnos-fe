
export enum Color {
    BLUE = 'blue',
    GRAY = 'gray',
    GREEN = 'green',
    ORANGE = 'orange',
    PURPLE = 'purple',
    RED = 'red',
}

export enum TribeName {
    CENTAURS = 'Centaurs',
    DWARVES = 'Dwarves',
    DRAGON = 'Dragons',
    ELVES = 'Elves',
    GIANTS = 'Giants',
    HALFLINGS = 'Halflings',
    MERFOLK = 'Merfolk',
    MINOTAURS = 'Minotaurs',
    ORCS = 'Orcs',
    SKELETONS = 'Skeletons',
    TROLLS = 'Trolls',
    WINGFOLK = 'Wingfolk',
    WIZARDS = 'Wizards',
}

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

export interface IBandDetails {
    bandSize: number;
    color: Color;
    tribe: TribeName;
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
    IN_BAND = 'in_band',
    IN_DECK = 'in_deck',
    IN_HAND = 'in_hand',
    IN_MARKET = 'in_market',
    REVEALED = 'revealed',
}

export interface ITribe {
    description: string;
    id: number;
    name: TribeName;
}

export interface IUser {
    id: number;
    username: string;
}

export interface IPlayer {
    cards: ICard[];
    gameId: number;
    giantTokenValue: number;
    id: number;
    merfolkTrackScore: number;
    orcTokens: Color[];
    trollTokens: number[];
    user: IUser;
    userId: number;
}

export interface ICard {
    color: Color;
    gameId: number;
    id: number;
    index: number;
    leaderId: number;
    playerId: number;
    state: CardState;
    tribe: ITribe;
    tribeId: number;
}

export interface IGameState {
    activePlayerId: number;
    age: number;
    cards: ICard[];
    createdAt: string;
    creator: IUser;
    creatorId: number;
    id: number;
    maxPlayers: number;
    players: IPlayer[];
    settings: IGameSettings;
    state: GameState;
    turnOrder: number[];
    updatedAt: string;
    winnerId: number;
}

export interface IActiveGame extends IGameState {
    hasPassword: boolean;
}
