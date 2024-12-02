import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';

import { useRef } from 'react';

import { TribeName } from '../Game/Game.types';
import { ICardProps } from './Card.types';

import centaurImg from '../../assets/tribes/centaurs.webp';
import dwarfImg from '../../assets/tribes/dwarves.webp';
import elfImg from '../../assets/tribes/elves.webp';
import giantImg from '../../assets/tribes/giants.webp';
import halflingImg from '../../assets/tribes/halflings.webp';
import merfolkImg from '../../assets/tribes/merfolk.webp';
import minotaurImg from '../../assets/tribes/minotaurs.webp';
import orcImg from '../../assets/tribes/orcs.webp';
import skeletonImg from '../../assets/tribes/skeletons.webp';
import trollImg from '../../assets/tribes/trolls.webp';
import wingfolkImg from '../../assets/tribes/wingfolk.webp';
import wizardImg from '../../assets/tribes/wizards.webp';
import dragonImg from '../../assets/tribes/dragon.webp';

import './Card.scss';

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
    [TribeName.DRAGON]: dragonImg,
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
            state,
            color,
            tribe,
            id
        },
        className,
        isLeader,
        selectable,
        selected,
        keep,
    } = props;

    const makeLeaderBtnRef = useRef(null);

    const classNames = [
        'card',
        className || '',
        color || '',
        state?.replace('_', '-') || '',
        tribe.name.toLowerCase(),
        selectable ? 'selectable' : '',
        selected ? 'selected' : '',
        keep ? 'keep' : '',
    ].filter(Boolean).join(' ');

    const handleSetLeader = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        props.onSetLeader(id);
    };

    const handleCardSelect = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === makeLeaderBtnRef?.current) {
            return
        }

        if (props.onSelect) {
            props.onSelect(props.card);
        }
    }

    return (
        <div
            className={classNames}
            style={(props.customStyles || {})}
            onMouseEnter={(event) => props.onMouseEnter ? props.onMouseEnter(event) : null}
            onMouseLeave={(event) => props.onMouseLeave ? props.onMouseLeave(event) : null}
            onMouseUp={handleCardSelect}
        >
            <div className="card-content"
                style={{
                    // @ts-ignore
                    backgroundImage: `url(${tribeImgs[tribe.name]})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            >
            <div className="tribe-name">
                {convertToSingularName(tribe.name)}
            </div>
            <div className="bottom-section">
                {!isLeader && selected && tribe.name !== TribeName.SKELETONS ?
                    <div className="set-leader-btn-wrapper">
                        <button
                            ref={makeLeaderBtnRef}
                            className="btn btn-action btn-3d btn-block btn-medium"
                            onMouseUp={handleSetLeader}
                        >
                            Make Leader <FontAwesomeIcon
                                icon={faCrown}
                            />
                        </button>
                    </div>
                    : null
                }
                <div className="tribe-description">
                    {tribe.description}
                </div>
            </div>
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
        </div>
    );
}
