import { TribeName } from '../Game/game.types';
import { ICardProps } from './Card.types';

import './Card.scss';

import centaurImg from '../../assets/centaurs.png';
import dwarfImg from '../../assets/dwarves.png';
import elfImg from '../../assets/elves.png';
import giantImg from '../../assets/giants.png';
import halflingImg from '../../assets/halflings.png';
import merfolkImg from '../../assets/merfolk.png';
import minotaurImg from '../../assets/minotaurs.png';
import orcImg from '../../assets/orcs.png';
import skeletonImg from '../../assets/skeletons.png';
import trollImg from '../../assets/trolls.png';
import wingfolkImg from '../../assets/wingfolk.png';
import wizardImg from '../../assets/wizards.png';

const tribeImgs = {
    [TribeName.CENTAURS]: centaurImg,
    [TribeName.DWARVES]: dwarfImg,
    [TribeName.ELVES]: elfImg,
    [TribeName.GIANTS]: giantImg,
    [TribeName.HALFLINGS]: halflingImg,
    [TribeName.MERFOLK]: merfolkImg,
    [TribeName.MINOTAURS]: minotaurImg,
    [TribeName.ORCS]: orcImg,
    [TribeName.SKELETONS]: skeletonImg,
    [TribeName.TROLLS]: trollImg,
    [TribeName.WINGFOLK]: wingfolkImg,
    [TribeName.WIZARDS]: wizardImg,
};

const convertToSingularName = (tribeName: TribeName) => {
    if (tribeName === TribeName.DWARVES) {
        return 'Dwarf';
    }

    if (tribeName === TribeName.ELVES) {
        return 'Elf';
    }


    return tribeName.replace(/s$/, '');
}

export function Card(props: ICardProps): JSX.Element {
    const { color, tribe } = props.card;

    return (
        <div
            className={`card ${color || ''} ${tribe.name.toLowerCase()}`}
            style={{
                // @ts-ignore
                backgroundImage: `url(${tribeImgs[tribe.name]})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                ...(props.customStyles || {})
            }}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
        >
            <div className="tribe-name">
                {convertToSingularName(tribe.name)}
            </div>
            <div className="tribe-description">
                {tribe.description}
            </div>
        </div>
    );
}
