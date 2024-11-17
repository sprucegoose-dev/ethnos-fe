import { ITribe, TribeName } from '../Game/Game.types';

export interface ITribeIconProps {
    onSelect?: (tribeName: TribeName) => void;
    selected?: boolean;
    showTribeName?: boolean;
    tribe: ITribe;
}
