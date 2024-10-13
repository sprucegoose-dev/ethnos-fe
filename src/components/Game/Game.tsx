import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { GameState, IActionPayload, IGameState } from './game.types';
import GameApi from '../../api/Game.api';
import { socket } from '../../socket';
import { GameSettings } from '../GameSettings/GameSettings';

import './Game.scss';

const {
    CREATED,
    ENDED,
    CANCELLED,
    STARTED,
} = GameState;

export function Game(): JSX.Element {
    const { id: gameId } = useParams();
    const [gameState, setGameState] = useState<IGameState>(null);
    const [ _actions, setActions ] = useState<IActionPayload[]>([]);

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
        }

        socket.emit('onJoinGame', gameId);
        socket.on('onUpdateGameState', updateGameState);

        return () => {
            socket.emit('onLeaveGame', gameId);
            socket.off('onUpdateGameState', updateGameState);
        }
    }, [gameId]);

    return (
        <div className="game-container">
            {gameState?.state === CREATED ?
                <GameSettings gameState={gameState} /> : null
            }
            {[STARTED, ENDED, CANCELLED].includes(gameState?.state) ?
                <div className="game">
                    Game
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
