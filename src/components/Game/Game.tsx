import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';

import { GameState, IActionPayload, IGameState } from './game.types';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';

import GameApi from '../../api/Game.api';
import { socket } from '../../socket';
import { GameSettings } from '../GameSettings/GameSettings';

import './Game.scss';
import { PlayerArea } from '../PlayerArea/PlayerArea';

const {
    CREATED,
    ENDED,
    CANCELLED,
    STARTED,
} = GameState;

export function Game(): JSX.Element {
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;
    const { id: gameId } = useParams();
    const [gameState, setGameState] = useState<IGameState>(null);
    const [ _actions, setActions ] = useState<IActionPayload[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getGameState = async () => {
            const response = await GameApi.getState(Number(gameId));
            setGameState(await response.json());
        }

        const getActions = async () => {
            const response = await GameApi.getActions(parseInt(gameId, 10));
            setActions(await response.json());
        }

        getGameState();

        const updateGameState = (payload: IGameState) => {
            setGameState(payload);
            getActions();

            if (payload.state === GameState.CANCELLED) {
                toast.info('The game has been cancelled');
                navigate('/rooms');
            }
        }

        socket.emit('onJoinGame', gameId);
        socket.on('onUpdateGameState', updateGameState);

        return () => {
            socket.emit('onLeaveGame', gameId);
            socket.off('onUpdateGameState', updateGameState);
        }
    }, [gameId]);

    const player = gameState?.players.find(player => player.userId === auth.userId);

    return (
        <div className="game-container">
            {gameState?.state === CREATED ?
                <GameSettings gameState={gameState} /> : null
            }
            {[STARTED, ENDED, CANCELLED].includes(gameState?.state) ?
                <div className="game">
                    <div className="">

                        Map

                    </div>
                    {player &&
                        <PlayerArea className="bottom" player={player} />
                    }
                </div> : null
            }
            <ToastContainer
                autoClose={2000}
                limit={1}
                pauseOnFocusLoss={false}
                theme="dark"
            />
        </div>
    );
}
