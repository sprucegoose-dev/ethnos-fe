import { ICard } from '../Game/game.types';

export interface ICardProps {
    className?: string;
    card: ICard;
    customStyles?: Object;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
    onClick?: (cardId: number) => any;
}
