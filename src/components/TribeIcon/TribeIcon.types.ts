import { ITribe, TribeName } from '../Game/game.types';

export interface ITribeIconProps {
    onSelectTribe?: (tribeName: TribeName) => void;
    selected?: boolean;
    tribe: ITribe;
}
