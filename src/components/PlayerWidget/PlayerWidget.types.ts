import { IPlayer, TribeName } from '../Game/Game.types';

export interface IPlayerWidgetProps {
    className: string;
    highestGiantToken: number;
    isActivePlayer: boolean;
    player: IPlayer;
    playerCount: number;
    tribes: TribeName[];
    onSelectWidgetIcon: (modal: WidgetModal) => void;
}

export enum WidgetModal {
    MERFOLK = 'MERFOLK',
    GIANTS = 'GIANTS',
    TROLLS = 'TROLLS',
    ORCS = 'ORCS',
    BANDS = 'BANDS',
    VICTORY_POINTS = 'VICTORY_POINTS',
}
