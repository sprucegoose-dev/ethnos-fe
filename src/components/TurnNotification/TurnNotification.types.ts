import { PlayerColor } from '../Game/Game.types';

export interface ITurnNotificationProps {
    className: string;
    color: PlayerColor;
    text: string,
}

export interface ITurnNotificationState {
    show: boolean;
    slideIn: boolean;
    slideOut: boolean;
}
