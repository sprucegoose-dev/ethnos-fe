import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import pako, { Data } from 'pako';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { getHighestGiantTokenValue, getPlayerPositions } from './helpers';
import GameApi from '../../api/Game.api';
import { socket } from '../../socket';
import {
    setSelectedCardIds,
    setSelectedCardIdsToKeep,
    setSelectedLeaderId
} from './Game.reducer';

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
    IKeepCardsPayload,
} from './Action.types';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';
import { IGameReducer } from './Game.reducer.types';
import { IRegion, regionOrder } from '../Region/Region.types';
import { IActionLogPayload } from '../ActionsLog/ActionsLog.types';
import { WidgetModal } from '../PlayerWidget/PlayerWidget.types';

import { GameSettings } from '../GameSettings/GameSettings';
import { Deck } from '../Deck/Deck';
import { Market } from '../Market/Market';
import { Region } from '../Region/Region';
import { PlayerWidget } from '../PlayerWidget/PlayerWidget';
import { PlayerHand } from '../PlayerHand/PlayerHand';
import { TurnNotification } from '../TurnNotification/TurnNotification';
import { useTurnNotification } from '../../hooks/useTurnNotification';

import { ActionsLog } from '../ActionsLog/ActionsLog';
import { Modal } from '../Modal/Modal';
import { MerfolkTrack } from '../MerfolkTrack/MerfolkTrack';
import { TrollTokens } from '../TrollTokens/TrollTokens';

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
        selectedCardIdsToKeep,
        selectedLeaderId,
    } = useSelector<IRootReducer>((state) => state.game) as IGameReducer;
    const dispatch = useDispatch();
    const { id: gameId } = useParams();
    const [ gameState, setGameState ] = useState<IGameState>(null);
    const [ actions, setActions ] = useState<IActionPayload[]>([]);
    const [ actionsLog, setActionsLog ] = useState<IActionLogPayload[]>([]);
    const [ activePlayer, setActivePlayer ] = useState<IPlayer>(null);
    const [ playerHands, setPlayerHands ] = useState<{[playerId: number]: ICard[]}>({});
    const [ cardsInHand, setCardsInHand ] = useState<ICard[]>([]);
    const { getTurnNotificationText, handleTurnNotification, turnNotificationState } = useTurnNotification();
    const [socketRefreshInterval, setSocketRefreshInterval] = useState(null);
    const [showDragonOverlay, setShowDragonOverlay] = useState<boolean>(false);
    const [revealedDragonsCount, setRevealedDragonsCount] = useState<number>(null);
    const [openWidgetModal, setOpenWidgetModal] = useState<string>(null);
    const prevRevealedDragonsCount = useRef(null);
    const navigate = useNavigate();
    const keepCardsAction = actions.find(action => action.type === ActionType.KEEP_CARDS) as IKeepCardsPayload;
    let  currentPlayer: IPlayer;
    let playerPosition: {[userId: number]: string};
    let highestGiantToken: number;

    const getRevealedDragonsCount = (state: IGameState) =>
        state?.cards.filter(card => card.tribe.name === TribeName.DRAGON && card.state === CardState.REVEALED)?.length ?? 0;

    useEffect(() => {
        if (!auth.userId) {
            navigate('/rooms');
        }

        const getActionsLog = async () => {
            const response = await GameApi.getActionsLog(parseInt(gameId, 10));
            setActionsLog(await response.json());
        };

        const getActions = async () => {
            const response = await GameApi.getActions(parseInt(gameId, 10));
            setActions(await response.json());
        };

        const getCardsInHand = async () => {
            const response = await GameApi.getCardsInHand(parseInt(gameId, 10));
            setCardsInHand(await response.json());
        };

        const getPlayerHands = async () => {
            const response = await GameApi.getPlayerHands(parseInt(gameId, 10));
            setPlayerHands(await response.json());
        };

        const getGameState = async () => {
            const response = await GameApi.getState(Number(gameId))
            const payload: IGameState = await response.json();

            if (payload.state === GameState.CANCELLED) {
                toast.info('The game has been cancelled');
                navigate('/rooms');
            }

            setRevealedDragonsCount(getRevealedDragonsCount(payload));
            setGameState(payload);

            if (payload.state !== GameState.CREATED) {
                const nextActivePlayer = payload.players.find(player => player.id === payload.activePlayerId);
                getCardsInHand();
                getPlayerHands();
                getActions();
                setActivePlayer(nextActivePlayer);
                getActionsLog();
                handleTurnNotification(nextActivePlayer);
            }
        };

        getGameState();

        const updateGameState = (compressedPayload: Data) => {
            const payload: IGameState = JSON.parse(pako.inflate(compressedPayload, { to: 'string' }));
            setGameState(payload);

            if (payload.state === GameState.CANCELLED) {
                toast.info('The game has been cancelled');
                navigate('/rooms');
            }

            if (payload.state !== GameState.CREATED) {
                const nextActivePlayer = payload.players.find(player => player.id === payload.activePlayerId);

                setActivePlayer(nextActivePlayer);
                getCardsInHand();
                getPlayerHands();
                getActions();
                getActionsLog();
                handleTurnNotification(nextActivePlayer);

                const newRevealedDragonsCount = getRevealedDragonsCount(payload);

                if (newRevealedDragonsCount !== revealedDragonsCount) {
                    setRevealedDragonsCount(newRevealedDragonsCount);
                }
            }
        }

        if (!socketRefreshInterval) {
            setSocketRefreshInterval(setInterval(async () => {
                if (!socket.connected) {
                    await socket.connect();
                    await socket.emit('onJoinGame', gameId);
                    getGameState();
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
    }, [auth, gameId, navigate, revealedDragonsCount, socketRefreshInterval]);

    useEffect(() => {
        if (prevRevealedDragonsCount.current === null && revealedDragonsCount !== null) {
            prevRevealedDragonsCount.current = revealedDragonsCount;
            return;
        }

        if (revealedDragonsCount > prevRevealedDragonsCount.current) {
            setShowDragonOverlay(true);

            setTimeout(() => {
                setShowDragonOverlay(false);
            }, 2000);

            prevRevealedDragonsCount.current = revealedDragonsCount;
        }
    }, [revealedDragonsCount]);

    if (!gameState) {
        return;
    }

    if ([STARTED, ENDED, CANCELLED].includes(gameState.state)) {
        currentPlayer =  gameState.players.find(player => player.userId === auth.userId);
        playerPosition = getPlayerPositions(currentPlayer, gameState.players, gameState.turnOrder);
        highestGiantToken = getHighestGiantTokenValue(gameState.players);
    }

    const clearSelections = () => {
        dispatch(setSelectedCardIds({ cardIds: [] }));
        dispatch(setSelectedLeaderId({ leaderId: null }));
        dispatch(setSelectedCardIdsToKeep({ cardIds: [] }));
    }

    const onSelectRegion = async (region?: IRegion) => {
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
                regionColor: region?.color
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

            const leader = cardsInHand.find(card => card.id === selectedLeaderId);

            if (region && leader.tribe.name !== TribeName.WINGFOLK && leader.color !== region.color) {
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
                regionColor: region?.color,
                leaderId: selectedLeaderId,
                cardIds: selectedCardIds,
            };
        }

        const response = await GameApi.sendAction(gameState.id, payload);

        if (response.ok) {
            clearSelections();
        }
    }

    const submitKeepCardsAction = async () => {
        const payload: IKeepCardsPayload = {
            type: ActionType.KEEP_CARDS,
            nextActionId: keepCardsAction.nextActionId,
            cardIds: selectedCardIdsToKeep,
        };

        const response = await GameApi.sendAction(gameState.id, payload);

        if (response.ok) {
            clearSelections();
        }
    };

    const canAddFreeToken = actions.find(action => action.type === ActionType.ADD_FREE_TOKEN);

    const sortedRegions = gameState.regions.sort((regionA, regionB) =>
        regionOrder[regionA.color] - regionOrder[regionB.color]
    );

    const selectedLeaderIsHalfling = selectedLeaderId &&
        cardsInHand.find(card =>
            card.id === selectedLeaderId
        )?.tribe.name === TribeName.HALFLINGS;

    return (
        <div className={`game-container ${gameState.state.toLowerCase()}`}>
            <Link to="/rooms">
                <button className="btn btn-outline btn-back">
                    <FontAwesomeIcon
                        className="back-icon"
                        icon={faChevronLeft}
                    /> Back
                </button>
            </Link>
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
                        {
                            selectedLeaderIsHalfling ?
                            <div className="play-band-notification" onClick={() => onSelectRegion()}>
                                Play Band
                            </div> : null
                        }
                        {
                            keepCardsAction ?
                            <div className="keep-cards-notification">
                                {
                                    selectedCardIdsToKeep.length === keepCardsAction.value ?
                                    <button
                                        className="btn btn-outline btn-3d"
                                        onClick={() => submitKeepCardsAction()}
                                    >
                                            Keep Selected Cards
                                    </button>
                                    : `Choose ${keepCardsAction.value} cards to keep`
                                }

                            </div>  : null
                        }
                    </div>
                    <Market gameState={gameState} activePlayer={activePlayer} />
                    <Deck gameState={gameState} activePlayer={activePlayer} actions={actions}/>
                    {gameState.players.map((player) =>
                        <div key={`player-area-${player.id}`}>
                            <PlayerHand
                                key={`player-hand-${player.id}`}
                                actions={player.id === currentPlayer.id ? actions : []}
                                className={playerPosition[player.userId]}
                                player={{...player, cardsInHand: player.id === currentPlayer.id ? cardsInHand : (playerHands[player.id] || [])}}
                            />
                            <PlayerWidget
                                key={`player-widget-${player.id}`}
                                className={playerPosition[player.userId]}
                                player={{...player, cardsInHand: player.id === currentPlayer.id ? cardsInHand : (playerHands[player.id] || [])}}
                                playerCount={gameState.players.length}
                                isActivePlayer={player.id === gameState.activePlayerId}
                                highestGiantToken={highestGiantToken}
                                tribes={gameState.settings.tribes}
                                onSelectWidgetIcon={(modal) => setOpenWidgetModal(modal)}
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
                    <ActionsLog
                        actionsLog={actionsLog}
                        cards={gameState.players.reduce((acc, player) => acc.concat([...player.cards]), [])}
                    />
                    {openWidgetModal ?
                        <Modal onClose={() => setOpenWidgetModal(null)} modalClass={`widget-modal ${openWidgetModal?.toLowerCase()}`}>
                            {openWidgetModal === WidgetModal.MERFOLK ?
                                <MerfolkTrack players={gameState.players} /> : null
                            }
                            {openWidgetModal === WidgetModal.TROLLS ?
                                <TrollTokens players={gameState.players} /> : null
                            }
                        </Modal> : null
                    }
                </div> : null
            }
        </div>
    );
}
