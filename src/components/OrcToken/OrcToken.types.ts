import { Color } from '../Game/Shared.types';

export interface IOrcTokenProps {
    className?: string;
    color: Color;
    onSelect?: (token: Color) => void;
}
