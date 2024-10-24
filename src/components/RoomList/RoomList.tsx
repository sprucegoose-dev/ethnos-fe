import { useEffect, useState } from 'react';
import { socket } from '../../socket';

import GameApi from '../../api/Game.api';
import { IActiveGame } from '../Game/Game.types';
import { Room } from '../Room/Room';
import { RoomForm } from '../RoomForm/RoomForm';

import './RoomList.scss';

export function RoomList(): JSX.Element {
    const [games, setGames] = useState<IActiveGame[]>([]);

    useEffect(() => {
        const getActiveGames = async () => {
            const response = await GameApi.getActiveGames();

            if (response.ok) {
                const activeGames = await response.json();
                setGames(activeGames);
            }
        }

        getActiveGames();

        socket.on('onUpdateActiveGames', getActiveGames);

        return () => {
            socket.off('onUpdateActiveGames', getActiveGames);
        }
    }, []);

    return (
        <div className="room-list">
            <RoomForm/>
            <div className="rooms-wrapper">
                <div className="rooms">
                    {games.map(game =>
                        <Room game={game} key={`room-${game.id}`} />
                    )}
                </div>
            </div>
        </div>
    );
}
