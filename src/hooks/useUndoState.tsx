import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { IGameState } from '../components/Game/Game.types';
import { IUndoRequestResponse, UndoRequestState } from '../components/Undo/Undo.types';
import { socket } from '../socket';

import UndoApi from '../api/Undo.api';
import { IAuthReducer } from '../components/Auth/Auth.types';
import { IRootReducer } from '../reducers/reducers.types';
import { useDispatch, useSelector } from 'react-redux';
import { setUndoModal } from '../components/Game/Game.reducer';

export function useUndoState(gameState: IGameState) {
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;
    const dispatch = useDispatch();
    const [ submitting, setSubmitting ] = useState<boolean>(false);
    const currentPlayer = gameState?.players.find(player => player.userId === auth.userId);
    const toastId = useRef(null);

    const requestUndo = async () => {
        if (submitting) {
            return;
        }

        setSubmitting(true);

        const response = await UndoApi.requestUndo(gameState?.id);

        if (!response.ok) {
            const error = await response.json();
            toast.info(error.message);
        }

        setSubmitting(false)
    };

    const sendDecision = async (decision: UndoRequestState, undoApprovalId: number) => {
        const response = await UndoApi.sendDecision(gameState?.id, {undoApprovalId, decision});

        if (response.ok) {
            dispatch(setUndoModal({ show: false, undoApprovalId: null, description: '' }));
        } else {
            const error = await response.json();
            toast.error(error.message);
        }
    };

    const getUndoState = async (gameState: IGameState) => {
        if (!gameState) {
            return;
        }

        const response = await UndoApi.getUndoState(gameState.id);
        const undoState: IUndoRequestResponse = await response.json();

        if (undoState.state === UndoRequestState.PENDING) {
            if (undoState.playerId === currentPlayer?.id) {
                if (!toastId.current) {
                    toastId.current = toast.info('Waiting for the other player(s) to approve your undo request.', {
                        autoClose: false,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                    });
                }
            } else {
                const approvalRequired = undoState.requiredApprovals.find(approval =>
                    approval.playerId === currentPlayer?.id &&
                    approval.state === UndoRequestState.PENDING
                );

                if (approvalRequired) {
                    dispatch(setUndoModal({
                        show: true,
                        undoApprovalId: approvalRequired.id,
                        description: undoState.description
                    }));
                }
            }
        } else if (toastId.current) {
            toast.dismiss(toastId.current);
            toastId.current = null;
        }
    };

    useEffect(() => {
        if (gameState?.id) {
            socket.on('onRequestUndo', () => getUndoState(gameState));
        }

        return () => {
            socket.off('onRequestUndo', getUndoState);
        }
    }, [gameState?.id]);

    useEffect(() => {
        if (gameState?.id && !toastId.current) {
            getUndoState(gameState);
        }
    }, [gameState?.id, gameState?.updatedAt]);

    useEffect(() => {
        if (toastId.current) {
            getUndoState(gameState);
        }
    }, [gameState, toastId.current]);

    return {
        requestUndo,
        sendDecision,
    }
};
