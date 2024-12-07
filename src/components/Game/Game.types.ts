import { IRegion } from '../Region/Region.types';
import { Color } from './Shared.types';

export enum PlayerColor {
    BLACK = 'black',
    BLUE = 'blue',
    GREEN = 'green',
    PINK = 'pink',
    WHITE = 'white',
    YELLOW = 'yellow',
}

export const PLAYER_COLORS = [
    PlayerColor.BLACK,
    PlayerColor.BLUE,
    PlayerColor.GREEN,
    PlayerColor.PINK,
    PlayerColor.WHITE,
    PlayerColor.YELLOW,
];

export const ORC_BOARD_POINTS: {[tokens: number]: number} = {
    1: 1,
    2: 3,
    3: 6,
    4: 10,
    5: 15,
    6: 20,
};

export enum TribeName {
    CENTAURS = 'Centaurs',
    DWARVES = 'Dwarves',
    DRAGON = 'Dragon',
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
    isBot: boolean;
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
    cardsInDeckCount: number;
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
    regions: IRegion[];
}

export interface IActiveGame extends IGameState {
    hasPassword: boolean;
}

export interface IAgePointsBreakdown {
    bands: number;
    giants: number;
    orcs: number;
    merfolk: number;
    regions: number;
}

export interface IPointsBreakdown {
    [age: string]: IAgePointsBreakdown;
}

export interface IPlayer {
    id: number;
    cardsInHand?: ICard[];
    color: PlayerColor;
    userId: number;
    gameId: number;
    giantTokenValue: number;
    orcTokens: Color[];
    trollTokens: number[];
    merfolkTrackScore: number;
    points: number;
    pointsBreakdown: IPointsBreakdown;
}
