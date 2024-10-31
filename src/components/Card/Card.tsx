import { TribeName } from '../Game/Game.types';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { MouseEventHandler } from 'react';

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
};

export function Card(props: ICardProps): JSX.Element {
    const {
        card: {
            color,
            tribe,
            id
        },
        className,
        isLeader,
        pauseAnimation,
        selectable,
        selected,
    } = props;

    const classNames = [
        'card',
        className || '',
        color || '',
        tribe.name.toLowerCase(),
        selectable ? 'selectable' : '',
        pauseAnimation ? 'paused' : '',
        selected ? 'selected' : '',
    ].filter(Boolean).join(' ');

    const handleSetLeader = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        props.onSetLeader(id)
    }

    return (
        <div
            className={classNames}
            style={{
                // @ts-ignore
                backgroundImage: `url(${tribeImgs[tribe.name]})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                ...(props.customStyles || {})
            }}
            onMouseEnter={(event) => props.onMouseEnter ? props.onMouseEnter(event) : null}
            onMouseLeave={(event) => props.onMouseLeave ? props.onMouseLeave(event) : null}
            onClick={() => props.onSelect ? props.onSelect(id) : null}
        >
           <div className="tribe-name">
                {convertToSingularName(tribe.name)}
            </div>
            <div className="tribe-description">
                {tribe.description}
            </div>
            {!isLeader && selected ?
                <div className="set-leader-btn-wrapper">
                    <button
                        className="btn btn-action btn-3d btn-block btn-medium"
                        onClick={handleSetLeader}
                    >
                        Make Leader <FontAwesomeIcon
                            icon={faCrown}
                        />
                    </button>
                </div>
                : null
            }
            {isLeader ?
                <>
                    <FontAwesomeIcon
                        className="leader-icon shadow"
                        icon={faCrown}
                    />
                    <FontAwesomeIcon
                        className="leader-icon"
                        icon={faCrown}
                    />
                </>
                 : null
            }
        </div>
    );
}
