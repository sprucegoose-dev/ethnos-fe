import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

import { IRoomProps } from './Room.types';
import { GameState, TribeName } from '../Game/Game.types';

import GameApi from '../../api/Game.api';

import './Room.scss';
import { toast } from 'react-toastify';
import { Modal } from '../Modal/Modal';
import { PasswordForm } from '../PasswordForm/PasswordForm';
import { useSelector } from 'react-redux';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';
import { renderRoomName, sortPlayersByBotStatus } from '../Game/helpers';

import centaurIcon from '../../assets/tribes/circle_icon_centaur.webp';
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

const tribeIcons = {
    [TribeName.CENTAURS]: centaurIcon,
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

export function Room({game}: IRoomProps): JSX.Element {
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;
    const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
    const [showConfirmLeaveModal, setShowConfirmLeaveModal] = useState<boolean>(false);
    const createdAt = moment(game.createdAt).fromNow()
    const navigate = useNavigate();

    const userInGame = () => {
        return game.players.find(player => player.userId === auth.userId);
    };

    const submitJoinGame = async() => {
        if (userInGame()) {
            navigate(`/game/${game.id}`);
            return;
        }

        if (game.hasPassword) {
            setShowPasswordModal(true);
            return;
        }

        const response = await GameApi.join(game.id);

        if (response.ok) {
            navigate(`/game/${game.id}`);
            toast.success('Joined game successfully');
        } else {
            const error = await response.json();

            if (error.code === 401) {
                toast.error('You must be logged in to join a game');
            } else {
                toast.error('Error joining game');
            }
        }
    };

    const onPasswordSuccess = () => {
        setShowPasswordModal(false);
        navigate(`/game/${game.id}`);
    }

    const submitLeaveGame = async() => {
        const response = await GameApi.leave(game.id);

        if (response.ok) {
            setShowConfirmLeaveModal(false);
        }
    };

    const renderGameState = () => {
        if (game.state === GameState.CREATED) {

            if (game.players.length === game.maxPlayers) {
                return 'Ready to start';
            }

            return 'Waiting for players';
        }

        if (game.state === GameState.STARTED) {
            return 'Game in progress';
        }

        return `${game.state.charAt(0).toUpperCase()}${game.state.slice(1)}`;
    }

    const sortedPlayers = sortPlayersByBotStatus(game.players);

    const tribes: TribeName[] = Array.from({ length: 6 }, (_, i) => game.settings.tribes[i] || null);

    return (
        <div className="room">
            <div className="room-title">
                <div className="room-name">
                    {renderRoomName(game.creator.username)}
                </div>
                <span className="player-count-label">
                    <FontAwesomeIcon
                        className="player-icon"
                        icon={faUser}
                    />
                        { game.players.length }/{ game.maxPlayers }
                </span>
                {game.hasPassword ?
                    <FontAwesomeIcon
                        className="password-icon"
                        icon={faLock}
                    /> : null
                }
            </div>
            <div className="players">
                {sortedPlayers.map(({ user }, index) =>
                    <Link
                        to={`/matches/${encodeURIComponent(user.username)}`}
                        key={`player-${index}`}
                        className="player"
                    >
                        <FontAwesomeIcon
                        className="player-icon"
                        icon={user.isBot ? faRobot : faUser}
                    /> {user.username}
                    </Link>
                )}
            </div>
            <div className="tribes">
                <div className="tribe-row">
                    {tribes.slice(0, 3).map((tribe, index) =>
                        <div className="tribe-icon" key={`tribe-${index}`}>
                            <div className="tribe-icon-inner">
                                {tribe ?
                                    // @ts-ignore
                                    <img className="tribe-img" src={tribeIcons[tribe]} alt={tribe} /> :
                                    <span className="tribe-placeholder">
                                        ?
                                    </span>
                                }
                            </div>
                        </div>
                    )}
                </div>
                <div className="tribe-row">
                    {tribes.slice(3).map((tribe, index) =>
                        <div className="tribe-icon" key={`tribe-${index}`}>
                            <div className="tribe-icon-inner">
                                {tribe ?
                                    // @ts-ignore
                                    <img className="tribe-img" src={tribeIcons[tribe]} alt={tribe} /> :
                                    <span className="tribe-placeholder">
                                        ?
                                    </span>
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="game-state">
                {renderGameState()}
            </div>
            <div className='join-room-wrapper'>
                {
                    game.state === GameState.CREATED &&
                    !userInGame() &&
                    game.players.length < game.maxPlayers &&
                    <button
                        className="btn btn-primary btn-3d btn-block join-btn"
                        type="submit"
                        onClick={submitJoinGame}
                    >
                        Join
                    </button>
                }
                {
                    userInGame() &&
                    <>
                        <button
                            className="btn btn-outline btn-block btn-3d leave-btn"
                            type="submit"
                            onClick={() =>  setShowConfirmLeaveModal(true)}
                        >
                            Leave
                        </button>
                        <button
                            className="btn btn-primary btn-block btn-3d rejoin-btn"
                            type="submit"
                            onClick={submitJoinGame}
                        >
                            Rejoin
                        </button>
                    </>
                }
                {
                    game.state !== GameState.CREATED &&
                    !userInGame() &&
                    <Link to={auth.userId ? `/game/${game.id}`: '/login'}>
                        <button
                            className="btn btn-primary btn-3d btn-block spectate-btn"
                            type="submit"
                        >
                            Spectate
                        </button>
                    </Link>
                }
            </div>
            <div className="footer created-at">
                Created {createdAt}
            </div>
            {showPasswordModal ?
                <Modal onClose={() => setShowPasswordModal(false)}>
                    <PasswordForm gameId={game.id} onSuccess={onPasswordSuccess} />
                </Modal>
            : null}
            {showConfirmLeaveModal ?
                <Modal onClose={() => setShowConfirmLeaveModal(false)} modalClass="confirm-leave-modal">
                    <div className="modal-form">
                        Are you sure you want to leave the game?

                        <div className="footer">
                            <button className="btn btn-muted btn-3d" onClick={() => setShowConfirmLeaveModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-action btn-3d" onClick={submitLeaveGame}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </Modal>
            : null}
        </div>
    );
}
