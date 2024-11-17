import { IPlayer, TribeName } from '../Game/Game.types';

export interface IPlayerWidgetProps {
    className: string;
    highestGiantToken: number;
    isActivePlayer: boolean;
    player: IPlayer;
    playerCount: number;
    tribes: TribeName[];
    onSelectWidgetIcon: (options: IActiveWidgetModal) => void;
}

export enum WidgetModal {
    MERFOLK = 'MERFOLK',
    GIANTS = 'GIANTS',
    TROLLS = 'TROLLS',
    ORCS = 'ORCS',
    BANDS = 'BANDS',
    VICTORY_POINTS = 'VICTORY_POINTS',
}

export interface IActiveWidgetModal {
    type: WidgetModal;
    player: IPlayer;
}
