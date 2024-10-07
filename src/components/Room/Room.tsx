import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import { IRoomProps } from './Room.types';
import { GameState, TribeName } from '../../types/game.types';

import GameApi from '../../api/Game.api';

import './Room.scss';
import { toast } from 'react-toastify';
import { Modal } from '../Modal/Modal';
import { PasswordForm } from '../PasswordForm/PasswordForm';
import { useSelector } from 'react-redux';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';

import centaurIcon from '../../assets/circle_icon_centaur.png';
import dwarfIcon from '../../assets/circle_icon_dwarf.png';
import elfIcon from '../../assets/circle_icon_elf.png';
import giantIcon from '../../assets/circle_icon_giant.png';
import halflingIcon from '../../assets/circle_icon_halfling.png';
import merfolkIcon from '../../assets/circle_icon_merfolk.png';
import minotaurIcon from '../../assets/circle_icon_minotaur.png';
import orcIcon from '../../assets/circle_icon_orc.png';
import skeletonIcon from '../../assets/circle_icon_skeleton.png';
import trollIcon from '../../assets/circle_icon_troll.png';
import wingfolkIcon from '../../assets/circle_icon_wingfolk.png';
import wizardIcon from '../../assets/circle_icon_wizard.png';

const tribeIcons = {
    [TribeName.CENTAUR]: centaurIcon,
    [TribeName.DWARF]: dwarfIcon,
    [TribeName.ELF]: elfIcon,
    [TribeName.GIANT]: giantIcon,
    [TribeName.HALFLING]: halflingIcon,
    [TribeName.MERFOLK]: merfolkIcon,
    [TribeName.MINOTAUR]: minotaurIcon,
    [TribeName.ORC]: orcIcon,
    [TribeName.SKELETON]: skeletonIcon,
    [TribeName.TROLL]: trollIcon,
    [TribeName.WINGFOLK]: wingfolkIcon,
    [TribeName.WIZARD]: wizardIcon,
};

export function Room({game}: IRoomProps): JSX.Element {
    const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
    const navigate = useNavigate();
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;

    const renderRoomName = () => {
        const username = game.creator.username;
        return `${username}${username.charAt(-1) === 's'? "'" : "'s"} Room`
    };

    const submitJoinGame = async() => {
        if (game.creatorId === auth.userId) {
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
            toast.error('Error joining game');
        }
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
                        {user.username}
                    </Link>
                )}
            </div>
            <div className="tribes">
                {tribes.map((tribe, index) =>
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
            <div className='action-btn-wrapper'>
                {(
                    game.state === GameState.CREATED &&
                    game.players.length < game.maxPlayers
                ) ?
                    <button
                        className="btn btn-primary btn-block"
                        type="submit"
                        onClick={submitJoinGame}
                    >
                        Join
                    </button> :
                    <Link to={`/game/${game.id}`}>
                        <button
                            className="btn btn-primary btn-block"
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
