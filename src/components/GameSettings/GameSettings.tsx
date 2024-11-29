import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faInfo, faRemove, faRobot } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import shuffle from 'lodash.shuffle';

import { IGameSettingsProps } from './GameSettings.types';
import { ITribe, PLAYER_COLORS, PlayerColor, TribeName } from '../Game/Game.types';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';

import TribeApi from '../../api/Tribe.api';
import GameApi from '../../api/Game.api';

import { TribeIcon } from '../TribeIcon/TribeIcon';

import { Modal } from '../Modal/Modal';
import { Card } from '../Card/Card';
import { PasswordForm } from '../PasswordForm/PasswordForm';
import { TokenIcon } from '../TokenIcon/TokenIcon';
import { sortPlayersByBotStatus } from '../Game/helpers';

import './GameSettings.scss';

export function GameSettings({gameState}: IGameSettingsProps): JSX.Element {
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;
    const navigate = useNavigate();
    const [tribes, setTribes] = useState<ITribe[]>([]);
    const [selectedTribes, setSelectedTribes] = useState<TribeName[]>(gameState.settings.tribes || []);
    const [showTribsModal, setShowTribesModal] = useState<boolean>(false);
    const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const currentPlayer = gameState.players.find(player => player.userId === auth.userId);
    const isGameCreator = auth.userId === gameState.creatorId;
    const tribeLimit = gameState.players.length >= 4 ? 6 : 5;

    useEffect(() => {
        const getTribes = async () => {
            const response = await TribeApi.getAll();
            setTribes(await response.json());
        };

        getTribes();
    }, []);

    useEffect(() => {
        setSelectedTribes(gameState.settings.tribes);
    }, [gameState.settings.tribes]);

    useEffect(() => {
        if (selectedTribes.length === 6 && gameState.players.length < 4) {
            const newSelectedTribes = shuffle(selectedTribes).slice(0, 5);
            setSelectedTribes(newSelectedTribes);
            GameApi.updateSettings(gameState.id, { tribes: newSelectedTribes});
        }
    }, [selectedTribes, gameState.id, gameState.players.length, tribes.length]);

    const renderRoomName = () => {
        const username = gameState.creator.username;
        return `${username}${username.charAt(-1) === 's'? "'" : "'s"} Room`
    };

    const handleSelectTribe = async (tribeName: TribeName) => {
        let newSelectedTribes;

        if (!isGameCreator) {
            toast.info('Only the game creator can select tribes');
            return;
        }

        if (selectedTribes.includes(tribeName)) {
            newSelectedTribes = selectedTribes.filter((name) => name !== tribeName);
        } else if (selectedTribes.length >= tribeLimit) {
            toast.info(`You can only select ${tribeLimit} tribes`);
            return;
        } else {
            newSelectedTribes = [...selectedTribes, tribeName];
        }

        setSelectedTribes(newSelectedTribes);

        await GameApi.updateSettings(gameState.id, { tribes: newSelectedTribes});
    };

    const randomizeTribes = async () => {
        if (!isGameCreator) {
            toast.info('Only the game creator can select tribes');
            return;
        }

        const newSelectedTribes = shuffle(tribes).slice(0, tribeLimit).map((tribe) => tribe.name);
        setSelectedTribes(newSelectedTribes);
        await GameApi.updateSettings(gameState.id, { tribes: newSelectedTribes});
    };

    const toggleTribesModal = (value: boolean) => {
        setShowTribesModal(value);
    };

    const submitAddBotPlayer = async () => {
        const response = await GameApi.addBotPlayer(gameState.id);

        if (!response.ok) {
            const error = await response.json();
            toast.error(error.message);
        }
    }

    const submitJoinGame = async () => {
        const response = await GameApi.join(gameState.id);

        if (!response.ok) {
            const error = await response.json();

            if (error.code === 403) {
                setShowPasswordModal(true);
            }
        }
    }

    const submitLeaveGame = async() => {
        await GameApi.leave(gameState.id);
        navigate('/rooms');
    };

    const submitRemoveBotPlayer = async (botPlayerId: number) => {
        await GameApi.removeBotPlayer(gameState.id, botPlayerId);
    }

    const submitStartGame = async () => {
        if (gameState.creatorId !== auth.userId) {
            toast.info('Only the game creator can start the game');
            return;
        }

        if (selectedTribes.length < tribeLimit) {
            toast.info(`Please select ${tribeLimit} tribes`);
            return;
        }

        if (submitting) {
            return;
        }

        setSubmitting(true);

        if (gameState.creatorId === auth.userId) {
            const response = await GameApi.start(gameState.id, { tribes: selectedTribes});

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            }
        }

        setSubmitting(false);
    };
    const onPasswordSuccess = () => {
        setShowPasswordModal(false);
    }

    const botCanBeAdded = () => {
        return auth.userId === gameState.creatorId &&
            gameState.players.length < gameState.maxPlayers;
    }

    const playerCanJoin = () => {
        return !currentPlayer && gameState.players.length < gameState.maxPlayers;
    }

    const selectColor = async (color: PlayerColor) => {
        if (!currentPlayer) {
            toast.info('Please join the game before selecting a color');
            return;
        }

        if (currentPlayer && gameState.players.find(player =>
                player.id !== currentPlayer.id &&
                player.color === color)
        ) {
            return;
        }

        if (currentPlayer.color === color) {
            color = null;
        }

        await GameApi.assignPlayerColor(gameState.id, color);
    };

    const shouldDisableColor = (color: PlayerColor): boolean => {
        return Boolean(currentPlayer &&
            currentPlayer.color !== color &&
            gameState.players.find(player => player.color === color));
    }

    const startBtnDisabled = auth.userId !== gameState.creatorId ||
        selectedTribes.length < tribeLimit ||
        submitting;

    const sortedPlayers = sortPlayersByBotStatus(gameState.players);

    return (
        <div className="game-settings">
            <div className="room-title">
                {renderRoomName()}
                {botCanBeAdded() &&
                    <button
                        className="btn btn-action btn-3d btn-mini add-bot-btn"
                        onClick={submitAddBotPlayer}
                    >
                        Add bot
                    </button>
                }
            </div>
            <div className="content">
                <div className="section players">
                    <div className="section-title players-title">
                        Players
                    </div>
                    {/* TODO: move into 'PlayerLabel' component */}
                    {sortedPlayers.map(({ id: playerId, color, user }, index) =>
                        <span className="player-label" key={`player-id-${playerId}`}>
                            {color ?
                                <TokenIcon
                                    color={color}
                                /> : null
                            }
                            {
                                user.isBot ?
                                <FontAwesomeIcon
                                    className="bot-icon"
                                    icon={faRobot}
                                /> : null
                            }
                            <Link
                                 to={`/matches/${encodeURIComponent(user.username)}`}
                                key={`player-${index}`}
                            >
                            {user.username}
                            </Link>
                            {
                                user.isBot && isGameCreator ?
                                <FontAwesomeIcon
                                    onClick={() => submitRemoveBotPlayer(playerId)}
                                    className="remove-bot-icon"
                                    icon={faRemove}
                                /> : null
                            }
                        </span>
                    )}
                    {playerCanJoin() &&
                        <button
                            className="btn btn-action btn-3d btn-mini"
                            onClick={submitJoinGame}
                        >
                            Join
                        </button>
                    }
                </div>
                <div className="section colors">
                    <div className="section-title settings-title">
                        Choose color
                    </div>
                    <div className="colors">
                        {PLAYER_COLORS.map(color =>
                            <TokenIcon
                                key={`token-icon-${color}`}
                                color={color}
                                disabled={shouldDisableColor(color)}
                                selected={currentPlayer?.color === color}
                                onSelect={selectColor}
                            />)
                        }
                    </div>
                </div>
                {tribes.length &&
                    <div className="section settings">
                        <div className="section-title settings-title">
                            Settings
                        </div>
                        <div className='instructions'>
                            Select {tribeLimit} <span className="tribes-text" onClick={() => toggleTribesModal(true)}>tribes
                                <span className="info-icon-wrapper">
                                    <FontAwesomeIcon
                                        className="info-icon"
                                        icon={faInfo}
                                    />
                                </span>
                            </span>
                            <span className="instructions-separator">OR</span>
                            <button
                                className={`btn btn-action btn-3d btn-mini ${isGameCreator ? '' : 'btn-disabled'}`}
                                onClick={randomizeTribes}
                            >
                                Randomize
                            </button>
                        </div>
                        <div className={`tribes ${isGameCreator ? '' : 'readonly'}`}>
                            {tribes.map((tribe, index) =>
                                <TribeIcon
                                    key={`tribe-icon-${index}`}
                                    onSelect={handleSelectTribe}
                                    selected={selectedTribes.includes(tribe.name)}
                                    tribe={tribe}
                                />
                            )}
                        </div>
                    </div>}
                <div>
                    <button
                        className={`btn btn-action btn-3d ${startBtnDisabled ? 'btn-disabled' : ''}`}
                        onClick={submitStartGame}
                    >
                        {submitting ?
                            <FontAwesomeIcon
                                className="loader-icon"
                                icon={faCircleNotch}
                            /> : null
                        } Start game
                    </button>
                </div>
            </div>
            <div className="btn-leave-wrapper">
                <button
                    className="btn btn-outline btn-3d btn-leave"
                    onClick={submitLeaveGame}
                >
                    Leave
                </button>
            </div>
            {showTribsModal ?
                    <Modal
                        modalClass='tribes-modal'
                        onClose={() => toggleTribesModal(false)}
                    >
                        {tribes.map((tribe, index) =>
                            <Card
                                key={`tribe-card-${index}`}
                                // @ts-ignore
                                card={{tribe}}
                            />
                        )}
                    </Modal>
                : null
            }
            {showPasswordModal ?
                <Modal onClose={() => setShowPasswordModal(false)}>
                    <PasswordForm gameId={gameState.id} onSuccess={onPasswordSuccess} />
                </Modal>
            : null}
        </div>
    );
}
