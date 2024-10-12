import { ITribeIconProps } from './TribeIcon.types';

import './TribeIcon.scss';

import centaurIcon from '../../assets/circle_icon_centaur_2.png';
import dwarfIcon from '../../assets/circle_icon_dwarf_2.png';
import elfIcon from '../../assets/circle_icon_elf_2.png';
import giantIcon from '../../assets/circle_icon_giant_2.png';
import halflingIcon from '../../assets/circle_icon_halfling_2.png';
import merfolkIcon from '../../assets/circle_icon_merfolk_2.png';
import minotaurIcon from '../../assets/circle_icon_minotaur_2.png';
import orcIcon from '../../assets/circle_icon_orc_2.png';
import skeletonIcon from '../../assets/circle_icon_skeleton_2.png';
import trollIcon from '../../assets/circle_icon_troll_2.png';
import wingfolkIcon from '../../assets/circle_icon_wingfolk_2.png';
import wizardIcon from '../../assets/circle_icon_wizard_2.png';
import { TribeName } from '../Game/game.types';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const tribeIcons = {
    [TribeName.CENTAUR]: centaurIcon,
    [TribeName.DWARF]: dwarfIcon,
    [TribeName.ELF]: elfIcon,
    [TribeName.GIANT]: giantIcon,
    [TribeName.HALFLING]: halflingIcon,
    [TribeName.MERFOLK]: merfolkIcon,
    [TribeName.MINOTAUR]: minotaurIcon,
    [TribeName.ORC]: orcIcon,
    [TribeName.SKELETON]: skeletonIcon,
    [TribeName.TROLL]: trollIcon,
    [TribeName.WINGFOLK]: wingfolkIcon,
    [TribeName.WIZARD]: wizardIcon,
};

export function TribeIcon({tribe}: ITribeIconProps): JSX.Element {
    return (
        <div className="tribe-icon">
            <img
                className="tribe-img"
                // @ts-ignore
                src={tribeIcons[tribe.name]}
                alt={tribe.name}
            />
            <div className="tribe-name">
                {tribe.name}
                {/* <FontAwesomeIcon className="info-icon" icon={faInfoCircle} /> */}
            </div>
        </div>
    );
}
