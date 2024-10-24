import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import { GameState, IActionPayload, ICard, IGameState, IPlayer } from './Game.types';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';

import GameApi from '../../api/Game.api';
import { socket } from '../../socket';
import { GameSettings } from '../GameSettings/GameSettings';

import './Game.scss';
import { PlayerArea } from '../PlayerArea/PlayerArea';
import { Deck } from '../Deck/Deck';
import { Market } from '../Market/Market';
import { getHighestGiantTokenValue, getPlayerPositions } from './helpers';

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
    const [ playerHands, setPlayerHands ] = useState<{[playerId: number]: ICard[]}>({});
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.userId) {
            navigate('/rooms');
        }

        const getGameState = async () => {
            const response = await GameApi.getState(Number(gameId));
            setGameState(await response.json());
        };

        const getActions = async () => {
            const response = await GameApi.getActions(parseInt(gameId, 10));
            setActions(await response.json());
        };

        const getPlayerHands = async () => {
            const response = await GameApi.getPlayerHands(parseInt(gameId, 10));
            setPlayerHands(await response.json());
        };

        getGameState();
        getPlayerHands();
        getActions();

        const updateGameState = (payload: IGameState) => {
            setGameState(payload);

            if (payload.state === GameState.CANCELLED) {
                toast.info('The game has been cancelled');
                navigate('/rooms');
            }

            setActivePlayer(payload.players.find(player => player.id === payload.activePlayerId));
            getActions();
            getPlayerHands();
        }

        socket.emit('onJoinGame', gameId);
        socket.on('onUpdateGameState', updateGameState);

        return () => {
            socket.emit('onLeaveGame', gameId);
            socket.off('onUpdateGameState', updateGameState);
        }
    }, [auth, gameId, navigate]);

    if (!gameState) {
        return;
    }

    const currentPlayer =  gameState.players.find(player => player.userId === auth.userId);
    const playerPosition = getPlayerPositions(currentPlayer, gameState.players, gameState.turnOrder);
    const highestGiantToken = getHighestGiantTokenValue(gameState.players);

    return (
        <div className={`game-container ${gameState.state.toLowerCase()}`}>
            {gameState.state === CREATED ?
                <GameSettings gameState={gameState} /> : null
            }
            {[STARTED, ENDED, CANCELLED].includes(gameState.state) ?
                <div className="game">
                    <Market gameState={gameState} activePlayer={activePlayer} />
                    <Deck gameState={gameState} activePlayer={activePlayer} />
                    {gameState.players.map((player) =>
                        <PlayerArea
                            key={player.id}
                            className={playerPosition[player.userId]}
                            player={{...player, cardsInHand: playerHands[player.id] || []}}
                            highestGiantToken={highestGiantToken}
                            tribes={gameState.settings.tribes}
                        />
                    )}
                </div> : null
            }
        </div>
    );
}
