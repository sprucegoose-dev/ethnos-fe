import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import {
    GameState,
    ICard,
    IGameState,
    IPlayer,
    IRegion,
} from './Game.types';
import {
    ActionType,
    IActionPayload,
    IAddFreeTokenPayload,
} from './Action.types';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';
import { IGameReducer } from './Game.reducer.types';

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
import { setSelectedCardIds, setSelectedLeaderId } from './Game.reducer';

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
    const [gameState, setGameState] = useState<IGameState>(null);
    const [ actions, setActions ] = useState<IActionPayload[]>([]);
    const [ activePlayer, setActivePlayer ] = useState<IPlayer>(null);
    const [ playerHands, setPlayerHands ] = useState<{[playerId: number]: ICard[]}>({});
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
            dispatch(setSelectedCardIds({ cardIds: [] }));
            dispatch(setSelectedLeaderId({ leaderId: null }));
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

        await GameApi.sendAction(gameState.id, payload);
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
                                />
                            )}
                        </div>
                        <div className="regions-row">
                            {sortedRegions.slice(3).map(region =>
                                <Region
                                    key={`region-${region.color}`}
                                    region={region}
                                    onSelect={onSelectRegion}
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
