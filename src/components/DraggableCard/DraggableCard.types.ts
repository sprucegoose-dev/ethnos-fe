export interface IDraggableCardProps {
    children: React.ReactNode;
    className: string;
    id: string;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}
