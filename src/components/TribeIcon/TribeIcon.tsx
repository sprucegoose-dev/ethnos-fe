import { ITribeIconProps } from './TribeIcon.types';

import './TribeIcon.scss';

import centaurIcon from '../../assets/tribes/circle_icon_centaur.webp';
import dragonIcon from '../../assets/tribes/circle_icon_dragon.webp';
import dwarfIcon from '../../assets/tribes/circle_icon_dwarf.webp';
import elfIcon from '../../assets/tribes/circle_icon_elf.webp';
import giantIcon from '../../assets/tribes/circle_icon_giant.webp';
import halflingIcon from '../../assets/tribes/circle_icon_halfling.webp';
import merfolkIcon from '../../assets/tribes/circle_icon_merfolk.webp';
import minotaurIcon from '../../assets/tribes/circle_icon_minotaur.webp';
import orcIcon from '../../assets/tribes/circle_icon_orc.webp';
import skeletonIcon from '../../assets/tribes/circle_icon_skeleton.webp';
import trollIcon from '../../assets/tribes/circle_icon_troll.webp';
import wingfolkIcon from '../../assets/tribes/circle_icon_wingfolk.webp';
import wizardIcon from '../../assets/tribes/circle_icon_wizard.webp';
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
