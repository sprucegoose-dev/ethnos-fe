import { IPlayer } from '../Game/Game.types';
import { Color } from '../Game/Shared.types';

export interface IPlayerRegion {
    regionId: number;
    playerId: number;
    tokens: number;
}

export interface IRegion {
    color: Color;
    gameId: number;
    id: number;
    values: number[];
    playerTokens: IPlayerRegion[];
}

export interface IRegionProps {
    onSelect: (region: IRegion) => void;
    region: IRegion;
    players: IPlayer[];
}

export const regionOrder: { [key: string]: number } = {
    [`${Color.BLUE}`]: 0,
    [`${Color.RED}`]: 1,
    [`${Color.GRAY}`]: 2,
    [`${Color.ORANGE}`]: 3,
    [`${Color.GREEN}`]: 4,
    [`${Color.PURPLE}`]: 5,
};
