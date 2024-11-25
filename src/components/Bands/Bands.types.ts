import { IPlayer } from '../Game/Game.types';

export interface IBandsProps {
    player: IPlayer;
    showBandScore?: boolean;
    showPointsTable?: boolean;
}
