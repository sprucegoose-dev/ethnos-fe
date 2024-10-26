import { PlayerColor } from '../Game/Game.types';

export interface ITokenIconProps {
    color: PlayerColor;
    disabled?: boolean;
    selected?: boolean;
    onSelect?: (color: PlayerColor) => void;
}
