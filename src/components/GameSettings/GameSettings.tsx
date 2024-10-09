import { useEffect, useState } from 'react';

import { IGameSettingsProps } from './GameSettings.types';
import { ITribe, TribeName } from '../../types/game.types';

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

import TribeApi from '../../api/Tribe.api';
import { Card } from '../Card/Card';

import './GameSettings.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const tribeImgs = {
    [TribeName.CENTAUR]: centaurImg,
    [TribeName.DWARF]: dwarfImg,
    [TribeName.ELF]: elfImg,
    [TribeName.GIANT]: giantImg,
    [TribeName.HALFLING]: halflingImg,
    [TribeName.MERFOLK]: merfolkImg,
    [TribeName.MINOTAUR]: minotaurImg,
    [TribeName.ORC]: orcImg,
    [TribeName.SKELETON]: skeletonImg,
    [TribeName.TROLL]: trollImg,
    [TribeName.WINGFOLK]: wingfolkImg,
    [TribeName.WIZARD]: wizardImg,
};

export function GameSettings(props: IGameSettingsProps): JSX.Element {
    const [tribes, setTribes] = useState<ITribe[]>([]);

    useEffect(() => {
        const getTribes = async () => {
            const response = await TribeApi.getAll();
            setTribes(await response.json());
        };

        getTribes();
    }, []);

    const getTribeDescription = (tribeName: TribeName): string => {
        return tribes.find(tribe => tribe.name === tribeName).description;
    };

    const handleStartGame = () => {

    };

    return (
        <div className="game-settings">
            <div className="content">
                <div className="players">
                    {/* TODO: move into 'PlayerLabel' component */}
                    {props.gameState.players.map(({ user }, index) =>
                        <Link
                            to={`/matches/${decodeURIComponent(user.username)}`}
                            key={`player-${index}`}
                            className="player"
                        >
                            <FontAwesomeIcon
                            className="player-icon"
                            icon={faUser}
                        /> {user.username}
                        </Link>
                    )}
                </div>
                {tribes.length ? <div className="tribes">
                    {Object.entries(tribeImgs).map(([tribe, image], index) =>
                        <Card
                            key={`tribe-card-${index}`}
                            tribe={tribe as TribeName}
                            image={image}
                            description={getTribeDescription(tribe as TribeName)}
                        />
                    )}
                </div> : null}
                <div>
                    <button className="btn btn-primary" onClick={handleStartGame}>
                        Start game
                    </button>
                </div>
            </div>

        </div>
    );
}
