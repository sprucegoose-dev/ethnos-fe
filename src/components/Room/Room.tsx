import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { IRoomProps } from './Room.types';
import { GameState } from '../../types/game.types';

import GameApi from '../../api/Game.api';

import './Room.scss';
import { toast } from 'react-toastify';
import { Modal } from '../Modal/Modal';
import { PasswordForm } from '../PasswordForm/PasswordForm';
import { useSelector } from 'react-redux';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';

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
            </div>


            {/* TODO: add x players/max players indicator */}
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
            {game.settings ? <div className="tribes">
                {game.settings.tribes.map((tribe, index) =>
                    <div key={`tribe=${tribe}`}>
                        {tribe}
                    </div>
                )}
            </div> : null}
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
