import { Color, IRegion } from '../Game/Game.types';

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
