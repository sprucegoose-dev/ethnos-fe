import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import shuffle from 'lodash.shuffle';

import { IGameSettingsProps } from './GameSettings.types';
import { ITribe, TribeName } from '../Game/game.types';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';

import TribeApi from '../../api/Tribe.api';
import GameApi from '../../api/Game.api';

import { TribeIcon } from '../TribeIcon/TribeIcon';

import './GameSettings.scss';

export function GameSettings({gameState}: IGameSettingsProps): JSX.Element {
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;
    const [tribes, setTribes] = useState<ITribe[]>([]);
    const [selectedTribes, setSelectedTribes] = useState<TribeName[]>(gameState.settings.tribes || []);

    useEffect(() => {
        const getTribes = async () => {
            const response = await TribeApi.getAll();
            setTribes(await response.json());
        };

        getTribes();
    }, []);

    const renderRoomName = () => {
        const username = gameState.creator.username;
        return `${username}${username.charAt(-1) === 's'? "'" : "'s"} Room`
    };

    const handleStartGame = async () => {
        if (gameState.creatorId !== auth.userId) {
            toast.info('Only the game creator can start the game');
            return;
        }

        if (selectedTribes.length < 6) {
            toast.info('Please select 6 tribes');
            return;
        }

        if (gameState.creatorId === auth.userId) {
            const response = await GameApi.start(gameState.id, { tribes: selectedTribes});

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            }
        }
    };

    const handleSelectTribe = async (tribeName: TribeName) => {
        let newSelectedTribes;

        if (selectedTribes.includes(tribeName)) {
            newSelectedTribes = selectedTribes.filter((name) => name !== tribeName);
        } else if (selectedTribes.length >= 6) {
            toast.info('You can only select 6 tribes');
            return;
        } else {
            newSelectedTribes = [...selectedTribes, tribeName];
        }

        setSelectedTribes(newSelectedTribes);

        await GameApi.updateSettings(gameState.id, { tribes: newSelectedTribes});
    };

    const randomizeTribes = async () => {
        const newSelectedTribes = shuffle(tribes).slice(0, 6).map((tribe) => tribe.name);
        setSelectedTribes(newSelectedTribes);
        await GameApi.updateSettings(gameState.id, { tribes: newSelectedTribes});
    }

    return (
        <div className="game-settings">
            <div className="room-title">
                {renderRoomName()}
            </div>
            <div className="content">
                <div className="players">
                    <div className="players-title">
                        Players
                    </div>
                    {/* TODO: move into 'PlayerLabel' component */}
                    {gameState.players.map(({ user }, index) =>
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
                {tribes.length &&
                    <div className="settings">
                        <div className="settings-title">
                            Settings
                        </div>
                        <div className='instructions'>
                            Select 6 tribes or
                            <button
                                className="btn btn-action btn-3d"
                                onClick={randomizeTribes}
                            >
                                Randomize
                            </button>
                        </div>
                        <div className="tribes">
                            {tribes.map((tribe, index) =>
                                <TribeIcon
                                    key={`tribe-icon-${index}`}
                                    onSelectTribe={handleSelectTribe}
                                    selected={selectedTribes.includes(tribe.name)}
                                    tribe={tribe}
                                />
                                // <Card
                                //     key={`tribe-card-${index}`}
                                //     tribe={tribe.name}
                                //     // @ts-ignore
                                //     image={tribeImgs[tribe.name]}
                                //     description={tribe.description}
                                // />
                            )}
                        </div>
                    </div>}
                <div>
                    <button
                        className={`btn btn-action btn-3d ${auth.userId !== gameState.creatorId || selectedTribes.length < 6 ? 'btn-disabled' : ''}`}
                        onClick={handleStartGame}
                    >
                        Start game
                    </button>
                </div>
            </div>

        </div>
    );
}
