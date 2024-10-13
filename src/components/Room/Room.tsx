import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import { IRoomProps } from './Room.types';
import { GameState, TribeName } from '../Game/game.types';

import GameApi from '../../api/Game.api';

import './Room.scss';
import { toast } from 'react-toastify';
import { Modal } from '../Modal/Modal';
import { PasswordForm } from '../PasswordForm/PasswordForm';
import { useSelector } from 'react-redux';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';

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
    const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
    const navigate = useNavigate();
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;

    const renderRoomName = () => {
        const username = game.creator.username;
        return `${username}${username.charAt(-1) === 's'? "'" : "'s"} Room`
    };

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

    const submitLeaveGame = async() => {
        await GameApi.leave(game.id);
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

    const tribes: TribeName[] = Array.from({ length: 6 }, (_, i) => game.settings.tribes[i] || null);

    return (
        <div className="room">
            <div className="room-title">
                <div className="room-name">
                    {renderRoomName()}
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
                {game.players.map(({ user }, index) =>
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
                            onClick={submitLeaveGame}
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
                    <Link to={`/game/${game.id}`}>
                        <button
                            className="btn btn-primary btn-block spectate-btn"
                            type="submit"
                        >
                            Spectate
                        </button>
                    </Link>
                }
            </div>
            {showPasswordModal ?
                <Modal onClose={() => setShowPasswordModal(false)}>
                    <PasswordForm gameId={game.id} />
                </Modal>
            : null}
        </div>
    );
}
