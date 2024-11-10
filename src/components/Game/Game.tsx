import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { getHighestGiantTokenValue, getPlayerPositions } from './helpers';
import GameApi from '../../api/Game.api';
import { socket } from '../../socket';
import { setSelectedCardIds, setSelectedLeaderId } from './Game.reducer';

import {
    CardState,
    GameState,
    ICard,
    IGameState,
    IPlayer,
    TribeName,
} from './Game.types';
import {
    ActionType,
    IActionPayload,
    IAddFreeTokenPayload,
} from './Action.types';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';
import { IGameReducer } from './Game.reducer.types';
import { IRegion, regionOrder } from '../Region/Region.types';
import { ITurnNotificationState } from '../TurnNotification/TurnNotification.types';

import { GameSettings } from '../GameSettings/GameSettings';
import { Deck } from '../Deck/Deck';
import { Market } from '../Market/Market';
import { Region } from '../Region/Region';
import { PlayerWidget } from '../PlayerWidget/PlayerWidget';
import { PlayerHand } from '../PlayerHand/PlayerHand';
import { TurnNotification } from '../TurnNotification/TurnNotification';

import './Game.scss';

const {
    CREATED,
    ENDED,
    CANCELLED,
    STARTED,
} = GameState;

export function Game(): JSX.Element {
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;
    const {
        selectedCardIds,
        selectedLeaderId,
    } = useSelector<IRootReducer>((state) => state.game) as IGameReducer;
    const dispatch = useDispatch();
    const { id: gameId } = useParams();
    const [ gameState, setGameState ] = useState<IGameState>(null);
    const [ actions, setActions ] = useState<IActionPayload[]>([]);
    const [ activePlayer, setActivePlayer ] = useState<IPlayer>(null);
    const [ playerHands, setPlayerHands ] = useState<{[playerId: number]: ICard[]}>({});
    const [ turnNotificationState, setTurnNotificationState ] = useState<ITurnNotificationState>({
            show: true,
            slideIn: false,
            slideOut: false,
    });
    const [socketRefreshInterval, setSocketRefreshInterval] = useState(null);
    const [showDragonOverlay, setShowDragonOverlay] = useState<boolean>(false);
    const [revealedDragonsCount, setRevealedDragonsCount] = useState<number>(null);
    const prevRevealedDragonsCount = useRef(null);
    const [ initialized, setInitialized ] = useState(false);
    const navigate = useNavigate();
    let  currentPlayer: IPlayer;
    let playerPosition: {[userId: number]: string};
    let highestGiantToken: number;

    const handleTurnNotification = (activePlayer: IPlayer) => {
        if (activePlayer.user.isBot) {
            return;
        }

        setTurnNotificationState({
            show: true,
            slideIn: true,
            slideOut: false
        });

        setTimeout(() => {
            setTurnNotificationState({
                show: true,
                slideIn: false,
                slideOut: true
            });
        }, 2000);

        setTimeout(() => {
            setTurnNotificationState({
                show: false,
                slideIn: false,
                slideOut: false
            });
        }, 2500);
    }

    const getRevealedDragonsCount = (state: IGameState) =>
        state?.cards.filter(card => card.tribe.name === TribeName.DRAGON && card.state === CardState.REVEALED)?.length ?? 0;

    useEffect(() => {
        if (!auth.userId) {
            navigate('/rooms');
        }

        const getGameState = async () => {
            const response = await GameApi.getState(Number(gameId))
            const payload: IGameState = await response.json();

            if (payload.state === GameState.CANCELLED) {
                toast.info('The game has been cancelled');
                navigate('/rooms');
            }

            setRevealedDragonsCount(getRevealedDragonsCount(payload));
            setGameState(payload);
            const nextActivePlayer = payload.players.find(player => player.id === payload.activePlayerId);
            setActivePlayer(nextActivePlayer);
            handleTurnNotification(nextActivePlayer);
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

            const nextActivePlayer = payload.players.find(player => player.id === payload.activePlayerId);

            setActivePlayer(nextActivePlayer);
            getPlayerHands();
            getActions();
            handleTurnNotification(nextActivePlayer);

            const newRevealedDragonsCount = getRevealedDragonsCount(payload);

            if (newRevealedDragonsCount !== revealedDragonsCount) {
                setRevealedDragonsCount(newRevealedDragonsCount);
            }
        }

        if (!socketRefreshInterval) {
            setSocketRefreshInterval(setInterval(async () => {
                if (!socket.connected) {
                    await socket.connect();
                    await socket.emit('onJoinGame', gameId);
                    getGameState();
                    getPlayerHands();
                    getActions();
                }
            }, 3000));
        }

        socket.emit('onJoinGame', gameId);
        socket.on('onUpdateGameState', updateGameState);

        return () => {
            clearInterval(socketRefreshInterval);
            socket.emit('onLeaveGame', gameId);
            socket.off('onUpdateGameState', updateGameState);
        }
    }, [auth, gameId, navigate]);

    useEffect(() => {
        if (prevRevealedDragonsCount.current === null && revealedDragonsCount !== null) {
            prevRevealedDragonsCount.current = revealedDragonsCount;

            setInitialized(true);
        }

        if (initialized && revealedDragonsCount > prevRevealedDragonsCount.current) {
            setShowDragonOverlay(true);

            setTimeout(() => {
                setShowDragonOverlay(false);
            }, 2000);

            prevRevealedDragonsCount.current = revealedDragonsCount;
        }
    }, [initialized, revealedDragonsCount]);

    if (!gameState) {
        return;
    }

    if ([STARTED, ENDED, CANCELLED].includes(gameState.state)) {
        currentPlayer =  gameState.players.find(player => player.userId === auth.userId);
        playerPosition = getPlayerPositions(currentPlayer, gameState.players, gameState.turnOrder);
        highestGiantToken = getHighestGiantTokenValue(gameState.players);
    }

    const onSelectRegion = async (region: IRegion) => {
        let payload: IActionPayload;

        if (gameState.activePlayerId !== currentPlayer.id) {
            toast.info('Please wait for your turn');
            return;
        }

        const addFreeTokenAction = actions.find(action =>
            action.type === ActionType.ADD_FREE_TOKEN
        ) as IAddFreeTokenPayload;

        if (addFreeTokenAction) {
            payload = {
                type: ActionType.ADD_FREE_TOKEN,
                nextActionId: addFreeTokenAction.nextActionId,
                regionColor: region.color
            };
        } else {

            if (!selectedCardIds.length) {
                toast.info('Please first select cards in your hand');
                return;
            }

            if (!selectedLeaderId) {
                toast.info('Please first select a leader for your band');
                return;
            }

            const leader = playerHands[activePlayer.id].find(card => card.id === selectedLeaderId);

            if (leader.tribe.name !== TribeName.WINGFOLK && leader.color !== region.color) {
                toast.info('Leader color must match the region color');
                return;
            }

            payload = {
                type: ActionType.PLAY_BAND,
                nextActionId: actions.find(action =>
                    action.type === ActionType.PLAY_BAND &&
                    action.nextActionId
                // @ts-ignore
                )?.nextActionId,
                regionColor: region.color,
                leaderId: selectedLeaderId,
                cardIds: selectedCardIds,
            };
        }

        const response = await GameApi.sendAction(gameState.id, payload);

        if (response.ok) {
            dispatch(setSelectedCardIds({ cardIds: [] }));
            dispatch(setSelectedLeaderId({ leaderId: null }));
        }
    }

    const canAddFreeToken = actions.find(action => action.type === ActionType.ADD_FREE_TOKEN);

    const getTurnNotificationText = (player: IPlayer) => {
        const username = player.user.username;

        return `${username}'${username.charAt(username.length - 1) === 's' ? '' : 's'} turn`;
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
                                    onSelect={onSelectRegion}
                                    players={gameState.players}
                                />
                            )}
                        </div>
                        <div className="regions-row">
                            {sortedRegions.slice(3).map(region =>
                                <Region
                                    key={`region-${region.color}`}
                                    region={region}
                                    onSelect={onSelectRegion}
                                    players={gameState.players}
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
                                isActivePlayer={player.id === gameState.activePlayerId}
                                highestGiantToken={highestGiantToken}
                                tribes={gameState.settings.tribes}
                            />
                            {canAddFreeToken ?
                                <div className="free-token-notifaction">
                                    Add a free token to any region
                                </div> : null
                            }
                        </div>
                    )}
                    {turnNotificationState.show ?
                        <TurnNotification
                            className={[
                                turnNotificationState.slideIn ? 'slide-in-right' : '',
                                turnNotificationState.slideOut ? 'slide-out-right' : '',
                            ].join(' ')}
                            color={activePlayer.color}
                            text={getTurnNotificationText(activePlayer)}
                        />
                    : null}
                    {showDragonOverlay ?
                        <div className="dragon-overlay"></div> : null
                    }
                </div> : null
            }
        </div>
    );
}
