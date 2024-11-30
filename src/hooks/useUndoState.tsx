import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { IGameState, IPlayer } from '../components/Game/Game.types';
import { IUndoRequestResponse, UndoRequestState } from '../components/Undo/Undo.types';

import UndoApi from '../api/Undo.api';

export function useUndoState(gameState: IGameState, currentPlayer: IPlayer) {
    const [ showUndoApprovalModal, setShowUndoApprovalModal ] = useState<boolean>(false);
    const [ submitting, setSubmitting ] = useState<boolean>(false);
    const [ undoApprovalId, setUndoApprovalId ] = useState<number>(null);
    const [ description, setDescription ] = useState<string>('');
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
            setShowUndoApprovalModal(false);
        } else {
            const error = await response.json();
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const getUndoState = async () => {
            const response = await UndoApi.getUndoState(gameState?.id);
            const undoState: IUndoRequestResponse = await response.json();

            if (undoState.state === UndoRequestState.PENDING) {
                if (undoState.playerId === currentPlayer?.id) {
                    toastId.current = toast.info('Waiting for the other player(s) to approve your request.', {
                        autoClose: false,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                    });
                } else {
                    const approvalRequired = undoState.requiredApprovals.find(approval =>
                        approval.playerId === currentPlayer?.id &&
                        approval.state === UndoRequestState.PENDING
                    );

                    if (approvalRequired) {
                        setDescription(undoState.description);
                        setUndoApprovalId(approvalRequired.id);
                        setShowUndoApprovalModal(true);
                    }
                }
            } else {
                if (toastId.current) {
                    toast.dismiss(toastId.current);
                }
            }
        };

        getUndoState();
    }, [gameState?.updatedAt, gameState?.id, currentPlayer?.id]);

    return {
        undoApprovalId,
        description,
        requestUndo,
        sendDecision,
        setShowUndoApprovalModal,
        showUndoApprovalModal,
    }
};
