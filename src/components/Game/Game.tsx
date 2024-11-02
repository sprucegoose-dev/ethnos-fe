import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import {
    GameState,
    IActionPayload,
    ICard,
    IGameState,
    IPlayer,
    IRegion,
} from './Game.types';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';

import GameApi from '../../api/Game.api';
import { socket } from '../../socket';
import { GameSettings } from '../GameSettings/GameSettings';

import './Game.scss';
import { Deck } from '../Deck/Deck';
import { Market } from '../Market/Market';
import { Region } from '../Region/Region';
import { getHighestGiantTokenValue, getPlayerPositions } from './helpers';
import { PlayerWidget } from '../PlayerWidget/PlayerWidget';
import { PlayerHand } from '../PlayerHand/PlayerHand';
import { regionOrder } from '../Region/Region.types';

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
    const [ actions, setActions ] = useState<IActionPayload[]>([]);
    const [ activePlayer, setActivePlayer ] = useState<IPlayer>(null);
    const [ playerHands, setPlayerHands ] = useState<{[playerId: number]: ICard[]}>({});
    const [ actionPayload, setActionPayload ] = useState<IActionPayload>({ type: null});
    const navigate = useNavigate();
    let  currentPlayer: IPlayer;
    let playerPosition: {[userId: number]: string};
    let highestGiantToken: number;

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

    const onSelectRegion = (_region: IRegion) => {


    }

    if (!gameState) {
        return;
    }

    if ([STARTED, ENDED, CANCELLED].includes(gameState.state)) {
        currentPlayer =  gameState.players.find(player => player.userId === auth.userId);
        playerPosition = getPlayerPositions(currentPlayer, gameState.players, gameState.turnOrder);
        highestGiantToken = getHighestGiantTokenValue(gameState.players);
    }

    const sortedRegions = gameState.regions.sort((regionA, regionB) =>
        regionOrder[regionA.color] - regionOrder[regionB.color]
    );

    return (
        <div className={`game-container ${gameState.state.toLowerCase()}`}>
            {gameState.state === CREATED ?
                <GameSettings gameState={gameState} /> : null
            }
            {[STARTED, ENDED, CANCELLED].includes(gameState.state) ?
                <div className="game">
                    <div className="regions-container">
                        <div className="regions-row">
                            {sortedRegions.slice(0, 3).map(region =>
                                <Region
                                    key={`region-${region.color}`}
                                    region={region}
                                    onClick={onSelectRegion}
                                />
                            )}
                        </div>
                        <div className="regions-row">
                            {sortedRegions.slice(3).map(region =>
                                <Region
                                    key={`region-${region.color}`}
                                    region={region}
                                    onClick={onSelectRegion}
                                />
                            )}
                        </div>
                    </div>
                    <Market gameState={gameState} activePlayer={activePlayer} />
                    <Deck gameState={gameState} activePlayer={activePlayer} actions={actions}/>
                    {gameState.players.map((player) =>
                        <div key={`player-area-${player.id}`}>
                            <PlayerHand
                                key={`player-hand-${player.id}`}
                                actions={actions}
                                className={playerPosition[player.userId]}
                                player={{...player, cardsInHand: playerHands[player.id] || []}}
                            />
                            <PlayerWidget
                                key={`player-widget-${player.id}`}
                                className={playerPosition[player.userId]}
                                player={{...player, cardsInHand: playerHands[player.id] || []}}
                                playerCount={gameState.players.length}
                                highestGiantToken={highestGiantToken}
                                tribes={gameState.settings.tribes}
                            />
                        </div>
                    )}
                </div> : null
            }
        </div>
    );
}
