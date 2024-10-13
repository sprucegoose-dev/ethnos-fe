import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRemove } from '@fortawesome/free-solid-svg-icons';

import { IModalProps } from './Modal.types';

import './Modal.scss';

export function Modal(props: IModalProps): JSX.Element {
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            props.onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className={`modal ${props.modalClass || ''}`}>
                <div className="modal-header">
                </div>
                {props.children &&
                    <div className="content">
                        {props.children}
                    </div>
                }
                <span
                        className="btn-close"
                        onClick={() => props.onClose()}
                    >
                        <FontAwesomeIcon className="btn-close-icon" icon={faRemove} />
                    </span>
            </div>
        </div>
    );
}
