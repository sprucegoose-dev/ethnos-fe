import { IPlayer, TribeName } from '../Game/Game.types';

export interface IPlayerWidgetProps {
    className: string;
    highestGiantToken: number;
    player: IPlayer;
    playerCount: number;
    tribes: TribeName[];
}
