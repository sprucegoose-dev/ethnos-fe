import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { IGameState, IPlayer } from '../components/Game/Game.types';
import { IUndoRequestResponse, UndoRequestState } from '../components/Undo/Undo.types';

import UndoApi from '../api/Undo.api';

export function useUndoState(gameState: IGameState, currentPlayer: IPlayer) {
    const [ showUndoApprovalModal, setShowUndoApprovalModal ] = useState<boolean>(false);
    const [ showUndoPendingModal, setShowUndoPendingModal ] = useState<boolean>(false);
    const [ submitting, setSubmitting ] = useState<boolean>(false);
    const [ approvalId, setApprovalId ] = useState<number>(null);

    const getUndoState = async () => {
        const response = await UndoApi.getUndoState(gameState.id);
        const undoState: IUndoRequestResponse = await response.json();

        if (undoState.state === UndoRequestState.PENDING) {
            if (undoState.playerId === currentPlayer.id) {
              setShowUndoPendingModal(true);
            } else {

                const approvalRequired = undoState.requiredApprovals.find(approval =>
                    approval.playerId === currentPlayer.id &&
                    approval.state === UndoRequestState.PENDING
                );

                if (approvalRequired) {
                    setShowUndoApprovalModal(true);
                    setApprovalId(approvalRequired.id);
                }
            }
        }
    };

    const requestUndo = async () => {
        if (submitting) {
            return;
        }

        setSubmitting(true);

        const response = await UndoApi.requestUndo(gameState.id);

        if (!response.ok) {
            const error = await response.json();
            toast.info(error.message);
        }

        setSubmitting(false)
    };

    const sendDecision = async (decision: UndoRequestState) => {
        const response = await UndoApi.sendDecision(gameState.id, decision);

        if (response.ok) {
            setShowUndoApprovalModal(false);
        } else {
            const error = await response.json();
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getUndoState();
    }, [gameState.updatedAt]);

    return {
        approvalId,
        requestUndo,
        sendDecision,
        setShowUndoApprovalModal,
        setShowUndoPendingModal,
        showUndoApprovalModal,
        showUndoPendingModal,
    }
};
