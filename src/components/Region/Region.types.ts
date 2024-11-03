import { Color } from '../Game/Shared.types';

export interface IRegion {
    color: Color;
    gameId: number;
    id: number;
    values: number[];
}

export interface IRegionProps {
    onSelect: (region: IRegion) => void;
    region: IRegion;
}

export const regionOrder: { [key: string]: number } = {
    [`${Color.BLUE}`]: 0,
    [`${Color.RED}`]: 1,
    [`${Color.GRAY}`]: 2,
    [`${Color.ORANGE}`]: 3,
    [`${Color.GREEN}`]: 4,
    [`${Color.PURPLE}`]: 5,
};
