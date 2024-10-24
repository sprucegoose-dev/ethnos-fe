import { IPlayer, TribeName } from '../Game/Game.types';

export interface IPlayerWidgetProps {
    className: string;
    highestGiantToken: number;
    player: IPlayer;
    tribes: TribeName[];
}
