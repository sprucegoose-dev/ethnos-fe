import { ICard } from '../Game/Game.types';

export interface ICardProps {
    className?: string;
    card: ICard;
    customStyles?: Object;
    isLeader?: boolean;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
    onSelect?: (card: ICard) => void;
    onSetLeader?: (cardId: number) => void;
    pauseAnimation?: boolean;
    selectable?: boolean;
    selected?: boolean;
}
