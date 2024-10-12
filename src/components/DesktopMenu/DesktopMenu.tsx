import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { Divider, Menu, MenuItem } from '@mui/material';

import { IMenuItem, MenuItemVisibility } from '../App/App.types';
import { IAuthReducer } from '../Auth/Auth.types';
import { IRootReducer } from '../../reducers/reducers.types';
import { UserAvatar } from '../UserAvatar/UserAvatar';
import { resetAuthDetails } from '../Auth/Auth.reducer';

import './DesktopMenu.scss';

const {
    ALWAYS,
    LOGGED_OUT,
    LOGGED_IN,
} = MenuItemVisibility;

export const menuItems: IMenuItem[] = [
    {
        label: 'Play',
        path: '/rooms',
        visibility: [ALWAYS],
    },
    {
        label: 'Rules',
        path: '/rules',
        visibility: [ALWAYS],
    },
    {
        label: 'Login',
        path: '/login',
        visibility: [LOGGED_OUT],
    },
    {
        label: 'Sign up',
        path: '/login/signUp',
        visibility: [LOGGED_OUT],
    },
];

export const filterMenuItem = (visibility: MenuItemVisibility[], isLoggedIn: boolean) => {

    if (visibility.includes(ALWAYS)) {
        return true;
    }

    if (visibility.includes(LOGGED_IN) && isLoggedIn) {
        return true;
    }

    if (visibility.includes(LOGGED_OUT) && !isLoggedIn) {
        return true;
    }

    return false;
};

export function DesktopMenu(): JSX.Element {
    const dispatch = useDispatch();
    const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;

    const isLoggedIn = Boolean(auth.userId);

    const filteredMenuItems = menuItems.filter(({ visibility }) => filterMenuItem(visibility, isLoggedIn));

    const openUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchor(event.currentTarget);
    };

    const closeUserMenu = () => {
        setUserMenuAnchor(null);
    };

    const logout = () => {
        dispatch(resetAuthDetails());
        toast.success('You have logged out successfully');
    };

    const handleCallback = (callbackName: string) => {
        switch (callbackName) {
            case 'logout':
                logout();
                break;
        }
    }

    return (
        <div className="menu desktop-menu">
            {filteredMenuItems.map(({ label, path, callbackName }, index) =>
                <Link
                    to={path}
                    key={`menu-item-${index}`}
                    className="menu-item link-secondary"
                    onClick={() => { handleCallback(callbackName) }}
                >
                    {label}
                </Link>
            )}
            {isLoggedIn ? <UserAvatar
                onClick={(event) => openUserMenu(event)}
            /> : null}
            <Menu
                anchorEl={userMenuAnchor}
                className="user-menu"
                open={Boolean(userMenuAnchor)}
                onClose={closeUserMenu}
                onClick={closeUserMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                MenuListProps={{
                    className: 'menu-items'
                }}
            >
                <MenuItem className="menu-item">
                    <FontAwesomeIcon className="menu-item-icon icon-logout" icon={faUser}/>
                    <span className="menu-item-label">
                        <Link
                            to="/account"
                            className="menu-item link-secondary"
                        >
                            {auth.username}
                        </Link>
                    </span>
                </MenuItem>
                <Divider />
                <MenuItem className="menu-item" onClick={logout}>
                    <FontAwesomeIcon className="menu-item-icon icon-logout" icon={faArrowRightFromBracket}/>
                    <span className="menu-item-label">
                        Logout
                    </span>
                </MenuItem>
            </Menu>
        </div>
    );
}
