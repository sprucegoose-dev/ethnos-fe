import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import pako, { Data } from 'pako';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faComment, faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';

import {
    getHighestGiantTokenValue,
    getPlayerPositions,
    initAudio
} from './helpers';
import GameApi from '../../api/Game.api';
import { socket } from '../../socket';

import {
    GameState,
    ICard,
    IGameState,
    IPlayer,
} from './Game.types';
import {
    ActionType,
    IActionPayload,
} from './Action.types';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';
import { IActionLogPayload } from '../ActionsLog/ActionsLog.types';
import { IActiveWidgetModal, WidgetModal } from '../PlayerWidget/PlayerWidget.types';

import { GameSettings } from '../GameSettings/GameSettings';
import { Deck } from '../Deck/Deck';
import { Market } from '../Market/Market';
import { PlayerWidget } from '../PlayerWidget/PlayerWidget';
import { PlayerHand } from '../PlayerHand/PlayerHand';
import { TurnNotification } from '../TurnNotification/TurnNotification';
import { useTurnNotification } from '../../hooks/useTurnNotification';

import { ActionsLog } from '../ActionsLog/ActionsLog';
import { Modal } from '../Modal/Modal';
import { MerfolkTrack } from '../MerfolkTrack/MerfolkTrack';
import { TrollTokens } from '../TrollTokens/TrollTokens';

import { OrcBoard } from '../OrcBoard/OrcBoard';
import { Bands } from '../Bands/Bands';
import { AgeResults } from '../AgeResults/AgeResults';
import { Regions } from '../Regions/Regions';
import { setAudioEnabled, setAudioMuted } from '../App/App.reducer';
import { IAppReducer } from '../App/App.reducer.types';
import './Game.scss';
import { useDragonOverlay } from '../../hooks/useDragonOverlay';
import { Chat } from '../Chat/Chat';

const {
    CREATED,
    ENDED,
    CANCELLED,
    STARTED,
} = GameState;

export function Game(): JSX.Element {
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;
    const { audioMuted } = useSelector<IRootReducer>((state) => state.app) as IAppReducer;
    const { id: gameId } = useParams();
    const [ gameState, setGameState ] = useState<IGameState>(null);
    const [ actions, setActions ] = useState<IActionPayload[]>([]);
    const [ actionsLog, setActionsLog ] = useState<IActionLogPayload[]>([]);
    const [ activePlayer, setActivePlayer ] = useState<IPlayer>(null);
    const [ playerHands, setPlayerHands ] = useState<{[playerId: number]: ICard[]}>({});
    const [ cardsInHand, setCardsInHand ] = useState<ICard[]>([]);
    const {
        getTurnNotificationText,
        handleTurnNotification,
        turnNotificationState
    } = useTurnNotification();
    const {
        showDragonOverlay,
    } = useDragonOverlay(gameState);
    const [socketRefreshInterval, setSocketRefreshInterval] = useState(null);
    const [openWidgetModal, setOpenWidgetModal] = useState<IActiveWidgetModal>({ type: null, player: null });
    const [ageResults, setAgeResults] = useState<IGameState>(null);
    const [showAgeResults, setShowAgeResults] = useState<boolean>(false);
    const [showChat, setShowChat] = useState<boolean>(false);
    const [audioInitialised, setAudioInitialized] = useState<boolean>(false);
    const [gameCards, setGameCards] = useState<ICard[]>([]);
    const prevAge = useRef<number>(0);
    const prevState = useRef<GameState>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const navigate = useNavigate();
    const isSpectator = auth.userId &&
        gameState?.state !== CREATED &&
        !gameState?.players.find(player => player.userId === auth.userId);
    let  currentPlayer: IPlayer;
    let playerPosition: {[userId: number]: string};
    let highestGiantToken: number;
    const dispatch = useDispatch();

    const toggleAudio = () => {
        dispatch(setAudioMuted({ audioMuted: !audioMuted }));
    }

    const enableAudio = async () => {
        if (audioInitialised) {
            return;
        }

        setAudioInitialized(true);
        dispatch(setAudioEnabled({ audioEnabled: true }));
        audioRef.current = await initAudio();
    }

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

        const getGameCards = async () => {
            const response = await GameApi.getGameCards(Number(gameId))
            const payload: ICard[] = await response.json();
            setGameCards(payload);
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

            setGameState(payload);

            if (payload.state !== GameState.CREATED) {
                const nextActivePlayer = payload.players.find(player => player.id === payload.activePlayerId);

                if (!isSpectator) {
                    getCardsInHand();
                    getActions();
                }

                getPlayerHands();
                setActivePlayer(nextActivePlayer);
                getActionsLog();
                handleTurnNotification(nextActivePlayer, audioRef.current, audioMuted);

                if (!gameCards.length) {
                    getGameCards();
                }
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

                if (!isSpectator) {
                    getCardsInHand();
                    getActions();
                }

                getPlayerHands();
                getActionsLog();
                handleTurnNotification(nextActivePlayer, audioRef.current, audioMuted);

                if (!gameCards.length) {
                    getGameCards();
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
    }, [audioMuted, auth, gameId, navigate, socketRefreshInterval]);

    useEffect(() => {
        if (!gameState) {
            return;
        }

        const getAgeResults = async (age: number) => {
            const response = await GameApi.getAgeResults(parseInt(gameId, 10), age);

            if (response.ok) {
                setAgeResults(await response.json());
                setShowAgeResults(true);
            }
        }

        if (gameState.state === ENDED) {
            getAgeResults(gameState.age);
        }

        if (prevAge.current === 0) {
            prevAge.current = gameState.age;
            prevState.current = gameState.state;

            if (gameState.state === ENDED) {
                getAgeResults(gameState.age);
            }
            return;
        }

        if (gameState.age > prevAge.current || (prevState.current === CREATED && gameState.state === ENDED)) {
            getAgeResults(prevAge.current);
            prevAge.current = gameState.age;
            prevState.current = gameState.state;
            return;
        }
    }, [gameState?.age, gameState?.state, gameId]);

    if (!gameState) {
        return;
    }

    if ([STARTED, ENDED, CANCELLED].includes(gameState.state)) {
        currentPlayer = isSpectator ?
            gameState.players[0] :
            gameState.players.find(player => player.userId === auth.userId);
        playerPosition = getPlayerPositions(currentPlayer, gameState.players, gameState.turnOrder);
        highestGiantToken = getHighestGiantTokenValue(gameState.players);
    }

    const canAddFreeToken = actions.find(action => action.type === ActionType.ADD_FREE_TOKEN);

    return (
        <div className={`game-container ${gameState.state.toLowerCase()}`} onClick={() => enableAudio()}>
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
                    <Regions
                        actions={actions}
                        cardsInHand={cardsInHand}
                        currentPlayer={currentPlayer}
                        gameState={gameState}
                    />
                    <Market gameState={gameState} activePlayer={activePlayer} />
                    <Deck
                        gameState={gameState}
                        activePlayer={activePlayer}
                        currentPlayer={{...currentPlayer, cardsInHand: playerHands[currentPlayer.id] || []}}
                        actions={actions}
                    />
                    {gameState.players.map((player) =>
                        <div key={`player-area-${player.id}`}>
                            <PlayerHand
                                key={`player-hand-${player.id}`}
                                actions={player.id === currentPlayer.id ? actions : []}
                                className={playerPosition[player.userId]}
                                player={{...player, cardsInHand: player.id === currentPlayer.id && !isSpectator ? cardsInHand : (playerHands[player.id] || [])}}
                                showCards={playerPosition[player.userId] === 'bottom' && !isSpectator}
                            />
                            <PlayerWidget
                                key={`player-widget-${player.id}`}
                                className={playerPosition[player.userId]}
                                player={{...player, cardsInHand: player.id === currentPlayer.id && !isSpectator ? cardsInHand : (playerHands[player.id] || [])}}
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
                    {actionsLog.length && gameCards.length ?
                        <ActionsLog
                            actionsLog={actionsLog}
                            cards={gameCards}
                        /> : null
                    }
                    {openWidgetModal.type ?
                        <Modal onClose={() => setOpenWidgetModal({ type: null, player: null })} modalClass={`widget-modal ${openWidgetModal.type.toLowerCase()}`}>
                            {openWidgetModal.type === WidgetModal.MERFOLK ?
                                <MerfolkTrack players={gameState.players} /> : null
                            }
                            {openWidgetModal.type === WidgetModal.TROLLS ?
                                <TrollTokens players={gameState.players} /> : null
                            }
                            {openWidgetModal.type === WidgetModal.ORCS ?
                                <OrcBoard player={openWidgetModal.player} /> : null
                            }
                            {openWidgetModal.type === WidgetModal.BANDS ?
                                <Bands player={openWidgetModal.player} /> : null
                            }
                        </Modal> : null
                    }
                    {showAgeResults && ageResults ?
                        <Modal onClose={() => setShowAgeResults(false)} modalClass="age-results-modal age-results">
                            <AgeResults gameState={ageResults} />
                        </Modal> : null
                    }
                    {isSpectator ? null : <Chat gameId={parseInt(gameId, 10)} players={gameState.players} />}
                    <button className="btn btn-outline btn-round toggle-sound-btn" onClick={toggleAudio}>
                        <FontAwesomeIcon icon={audioMuted ? faVolumeXmark : faVolumeHigh} />
                    </button>
                </div> : null
            }
        </div>
    );
}
