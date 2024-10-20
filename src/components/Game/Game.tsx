import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';

import { GameState, IActionPayload, IGameState, IPlayer } from './game.types';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';

import GameApi from '../../api/Game.api';
import { socket } from '../../socket';
import { GameSettings } from '../GameSettings/GameSettings';

import './Game.scss';
import { PlayerArea } from '../PlayerArea/PlayerArea';
import { Deck } from '../Deck/Deck';
import { Market } from '../Market/Market';

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
    const [ activePlayer, setActivePlayer ] = useState<IPlayer>(null);
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

            if (payload.state === GameState.CANCELLED) {
                toast.info('The game has been cancelled');
                navigate('/rooms');
            }

            getActions();
            setActivePlayer(payload.players.find(player => player.id === gameState.activePlayerId));
        }

        socket.emit('onJoinGame', gameId);
        socket.on('onUpdateGameState', updateGameState);

        return () => {
            socket.emit('onLeaveGame', gameId);
            socket.off('onUpdateGameState', updateGameState);
        }
    }, [gameId]);

    const getPlayerPositions = (players: IPlayer[]): {[userId: number]: string} => {
        const positionsByPlayerCount: {[key: number]: string[]} = {
            2: ['top', 'bottom'],
            3: ['left', 'right', 'bottom'],
            4: ['top', 'left', 'right', 'bottom'],
            5: ['top', 'left-corner', 'right-corner', 'bottom', 'left', 'right'],
            6: ['top', 'left-corner', 'right-corner', 'bottom', 'left', 'right'],
        };

        const playerCount = players.length;
        const positions = positionsByPlayerCount[playerCount] || [];
        const currentPlayer = players.find(player => player.userId === auth.userId);

        if (!currentPlayer || !positions.length) return {};

        const remainingPositions = positions.filter(pos => pos !== 'bottom');

        const playerPosition = { [currentPlayer.userId]: 'bottom' };

        let index = 0;

        for (const player of players) {
            if (player.userId !== currentPlayer.userId) {
                playerPosition[player.userId] = remainingPositions[index++];
            }
        }

        return playerPosition;
    };

    const playerPosition = gameState ? getPlayerPositions(gameState.players) : {};

    return (
        <div className={`game-container ${gameState?.state.toLowerCase()}`}>
            {gameState?.state === CREATED ?
                <GameSettings gameState={gameState} /> : null
            }
            {[STARTED, ENDED, CANCELLED].includes(gameState?.state) ?
                <div className="game">
                    <Market gameState={gameState} activePlayer={activePlayer} />
                    <Deck gameState={gameState} activePlayer={activePlayer} />
                    {gameState.players.map((player) =>
                        <PlayerArea key={player.id} className={playerPosition[player.userId]} player={player} />
                    )}
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
