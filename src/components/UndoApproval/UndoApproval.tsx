import { IUndoApprovalProps } from './UndoApproval.types';
import { useUndoState } from '../../hooks/useUndoState';
import { UndoRequestState } from '../Undo/Undo.types';
import './UndoApproval.scss';

export function UndoApproval({ currentPlayer, gameState }: IUndoApprovalProps): JSX.Element {
    const {
        undoApprovalId,
        description,
        sendDecision
    } = useUndoState(gameState, currentPlayer);

    return (
        <div className="undo-approval">
            <h2 className="title">Undo requested</h2>
            <div className="modal-form">
                {description}

                <div className="footer">
                    <button className="btn btn-muted btn-3d" onClick={() => sendDecision(UndoRequestState.REJECTED, undoApprovalId)}>
                        No
                    </button>
                    <button className="btn btn-action btn-3d" onClick={() => sendDecision(UndoRequestState.APPROVED, undoApprovalId)}>
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
}
