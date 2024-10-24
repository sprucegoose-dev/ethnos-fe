import { ICard } from '../Game/Game.types';

export interface ICardProps {
    className?: string;
    card: ICard;
    customStyles?: Object;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
    onClick?: (cardId: number) => any;
}
