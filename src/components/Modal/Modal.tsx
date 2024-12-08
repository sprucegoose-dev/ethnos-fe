import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronDown,
    faChevronUp,
    faRemove
} from '@fortawesome/free-solid-svg-icons';

import { IModalProps } from './Modal.types';

import './Modal.scss';

export function Modal(props: IModalProps): JSX.Element {
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (props.minimized) {
            return;
        }

        if (e.target === e.currentTarget) {
            props.onClose();
        }
    };

    return (
        <div
            className={`modal-backdrop ${props.minimized ? 'minimized' : ''}`}
            onClick={handleBackdropClick}
        >
            <div className={`modal ${props.modalClass || ''} ${props.minimized ? 'minimized' : ''}`}>
                <div className="modal-header">
                </div>
                {props.children &&
                    <div className="content">
                        {props.children}
                    </div>
                }
                {props.onClose ?
                    <span
                            className="btn-close"
                            onClick={() => props.onClose()}
                        >
                            <FontAwesomeIcon className="btn-close-icon" icon={faRemove} />
                        </span>
                    : null
                }
                {props.onMinimize ?
                    <span
                        className="btn-minimize"
                        onClick={() => props.onMinimize()}
                    >
                        <FontAwesomeIcon className="btn-minimize-icon" icon={props.minimized ? faChevronUp : faChevronDown} />
                    </span>
                : null
                }
            </div>
        </div>
    );
}
