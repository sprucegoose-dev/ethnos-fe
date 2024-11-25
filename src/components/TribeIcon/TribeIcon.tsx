import { ITribeIconProps } from './TribeIcon.types';

import './TribeIcon.scss';

import centaurIcon from '../../assets/tribes/circle_icon_centaur.png';
import dragonIcon from '../../assets/tribes/circle_icon_dragon.png';
import dwarfIcon from '../../assets/tribes/circle_icon_dwarf.png';
import elfIcon from '../../assets/tribes/circle_icon_elf.png';
import giantIcon from '../../assets/tribes/circle_icon_giant.png';
import halflingIcon from '../../assets/tribes/circle_icon_halfling.png';
import merfolkIcon from '../../assets/tribes/circle_icon_merfolk.png';
import minotaurIcon from '../../assets/tribes/circle_icon_minotaur.png';
import orcIcon from '../../assets/tribes/circle_icon_orc.png';
import skeletonIcon from '../../assets/tribes/circle_icon_skeleton.png';
import trollIcon from '../../assets/tribes/circle_icon_troll.png';
import wingfolkIcon from '../../assets/tribes/circle_icon_wingfolk.png';
import wizardIcon from '../../assets/tribes/circle_icon_wizard.png';
import { TribeName } from '../Game/Game.types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const tribeIcons = {
    [TribeName.CENTAURS]: centaurIcon,
    [TribeName.DRAGON]: dragonIcon,
    [TribeName.DWARVES]: dwarfIcon,
    [TribeName.ELVES]: elfIcon,
    [TribeName.GIANTS]: giantIcon,
    [TribeName.HALFLINGS]: halflingIcon,
    [TribeName.MERFOLK]: merfolkIcon,
    [TribeName.MINOTAURS]: minotaurIcon,
    [TribeName.ORCS]: orcIcon,
    [TribeName.SKELETONS]: skeletonIcon,
    [TribeName.TROLLS]: trollIcon,
    [TribeName.WINGFOLK]: wingfolkIcon,
    [TribeName.WIZARDS]: wizardIcon,
};

export function TribeIcon(props: ITribeIconProps): JSX.Element {
    const {
        onSelect,
        selected,
        tribe,
        showTribeName = true,
    } = props;

    return (
        <div className="tribe-icon">
            <img
                className={`tribe-img ${onSelect ? 'selectable' : ''}`}
                // @ts-ignore
                src={tribeIcons[tribe.name]}
                alt={tribe.name}
                onClick={() => onSelect ? onSelect(tribe.name) : null}
            />
            {showTribeName ?
                <div className="tribe-name">
                    {tribe.name}
                </div> : null
            }
            {selected ?
                <FontAwesomeIcon className="selected-icon" icon={faCheckCircle} /> :
                null
            }
        </div>
    );
}
