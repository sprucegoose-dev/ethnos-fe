import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

import { IDraggableCardProps } from './DraggableCard.types';

export function DraggableCard(props: IDraggableCardProps): JSX.Element {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
      } = useSortable({id: props.id});

    const draggableStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            className={props.className}
            ref={setNodeRef}
            style={draggableStyle}
            {...listeners}
            {...attributes}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
        >
            {props.children}
        </div>
    );
}
