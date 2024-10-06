import { Link } from 'react-router-dom';
import { IRoomProps } from './Room.types';
import './Room.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import GameApi from '../../api/Game.api';
import { GameState } from '../../types/game.types';

export function Room({game}: IRoomProps): JSX.Element {

    const renderRoomName = () => {
        const username = game.creator.username;
        return `${username}${username.charAt(-1) === 's'? "'" : "'s"} Room`
    };

    const onSubmit = async() => {
        // TODO: prompt to enter password if the room has one

        await GameApi.join(game.id);
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
                        onClick={onSubmit}
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
        </div>
    );
}
