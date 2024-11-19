import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { IAccountProps } from './Account.types';
import { IAuthReducer } from '../Auth/Auth.types';
import { IRootReducer } from '../../reducers/reducers.types';

import UserApi from '../../api/User.api';
import { Modal } from '../Modal/Modal';

import './Account.scss';
import { resetAuthDetails } from '../Auth/Auth.reducer';

export function Account(_props: IAccountProps): JSX.Element {
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDeleteAccount = async () => {
        const response =await UserApi.delete();

        if (response.ok) {
            dispatch(resetAuthDetails());
            toast.success('You have deleted your account successfully');
            navigate('/login');
        } else {
            toast.error('Error deleting account');
        }
    };

    useEffect(() => {
        if (!auth.userId) {
            navigate('/rooms');
        }
    });

    return (
        <div className="account">
            <div className="title-wrapper">
                <h2 className="title">Account</h2>
            </div>
            <div className="content">
                <form className="form">
                    <div className="form-control-wrapper">
                        <label className="control-label">Username</label>
                        <input
                            className="form-control"
                            value={auth.username || ''}
                            disabled={true}
                            placeholder="Username"
                            name="username"
                            autoComplete="off"
                        />
                    </div>
                    <div className="form-control-wrapper">
                        <label className="control-label">Password</label>
                        <input
                            className="form-control"
                            value=""
                            placeholder="Password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            disabled={true}
                        />
                    </div>
                </form>
                <div className="delete-account">
                    <button className="btn btn-primary btn-3d" onClick={() => setShowDeleteModal(true)}>
                        Delete Account
                    </button>
                </div>
            </div>
            {showDeleteModal ?
                <Modal onClose={() => setShowDeleteModal(false)} modalClass="delete-account-modal">
                    <div className="title">
                        Delete Account
                    </div>
                    <div className="message">
                        Are you sure you want to delete your account?
                    </div>
                    <div className="footer">
                        <button className="btn btn-muted btn-3d" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-action btn-3d" onClick={handleDeleteAccount}>
                            Confirm
                        </button>
                    </div>
                </Modal> : null
            }
        </div>
    );
}
