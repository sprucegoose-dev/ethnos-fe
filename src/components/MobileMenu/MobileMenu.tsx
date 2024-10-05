import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faBars } from '@fortawesome/free-solid-svg-icons';
import { Drawer, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';

import { filterMenuItem, menuItems } from '../DesktopMenu/DesktopMenu';
import { UserAvatar } from '../UserAvatar/UserAvatar';
import { IAuthReducer } from '../Auth/Auth.types';
import { IRootReducer } from '../../reducers/reducers.types';
import { resetAuthDetails } from '../Auth/Auth.reducer';

import './MobileMenu.scss';

export function MobileMenu(): JSX.Element {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;

    const isLoggedIn = Boolean(auth.userId);

    const filteredMenuItems = menuItems.filter(({ visibility }) => filterMenuItem(visibility, Boolean(auth.userId)));

    const logout = () => {
        dispatch(resetAuthDetails());
        toast.success('You have logged out successfully');
    };

    return (
        <div className="mobile-menu">
            <FontAwesomeIcon
                className="menu-btn"
                icon={faBars}
                onClick={() => setOpen(true)}
            />
            <Drawer
                className="menu mobile-menu-sidebar"
                anchor={'right'}
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    className: "mobile-menu-sidebar-content",
                }}
            >
                {isLoggedIn ?
                    <UserAvatar label={auth.username} /> : null
                }
                {filteredMenuItems.map(({ label, path }, index) =>
                    <Link to={path} key={`menu-item-${index}`} className="menu-item link-secondary">
                        {label}
                    </Link>
                )}
                <MenuItem className="menu-item" onClick={logout}>
                    <FontAwesomeIcon className="menu-item-icon icon-logout" icon={faArrowRightFromBracket}/>
                    <span className="menu-item-label">
                        Logout
                    </span>
                </MenuItem>
            </Drawer>
        </div>
    );
}
