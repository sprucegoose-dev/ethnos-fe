import { IRegion } from '../Game/Game.types';

export interface IRegionProps {
    onClick: (region: IRegion) => void;
    region: IRegion;
}
