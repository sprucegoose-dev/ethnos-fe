import { PlayerColor } from '../Game/Game.types';

export interface ITokenIconProps {
    className?: string;
    color: PlayerColor;
    disabled?: boolean;
    onSelect?: (color: PlayerColor) => void;
    selected?: boolean;
    text?: string | number;
}
