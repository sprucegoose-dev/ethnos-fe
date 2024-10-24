import { ITribe, TribeName } from '../Game/Game.types';

export interface ITribeIconProps {
    onSelectTribe?: (tribeName: TribeName) => void;
    selected?: boolean;
    tribe: ITribe;
}
