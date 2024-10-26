import { PlayerColor } from '../Game/Game.types';

export interface ITokenIconProps {
    color: PlayerColor;
    selected?: boolean;
    onSelect?: (color: PlayerColor) => void;
}
