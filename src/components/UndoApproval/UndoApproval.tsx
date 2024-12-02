import { IUndoApprovalProps } from './UndoApproval.types';
import { useUndoState } from '../../hooks/useUndoState';
import { UndoRequestState } from '../Undo/Undo.types';
import './UndoApproval.scss';
import { IGameReducer } from '../Game/Game.reducer.types';
import { IRootReducer } from '../../reducers/reducers.types';
import { useSelector } from 'react-redux';

export function UndoApproval({ gameState }: IUndoApprovalProps): JSX.Element {
    const { sendDecision } = useUndoState(gameState);
    const { undoModal: {
        description,
        undoApprovalId
    }  } = useSelector<IRootReducer>((state) => state.game) as IGameReducer;

    return (
        <div className="undo-approval">
            <div className="modal-form">
                <div className="title">Undo requested</div>
                <div className="modal-content">
                    {description}
                </div>
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
