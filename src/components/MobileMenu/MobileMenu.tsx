import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Drawer } from '@mui/material';

import { filterMenuItem, menuItems } from '../DesktopMenu/DesktopMenu';
import { UserAvatar } from '../UserAvatar/UserAvatar';
import { IAuthReducer } from '../Auth/Auth.types';
import { IRootReducer } from '../../reducers/reducers.types';

import './MobileMenu.scss';

export function MobileMenu(): JSX.Element {
    const [open, setOpen] = useState(false);

    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;

    const filteredMenuItems = menuItems.filter(({ visibility }) => filterMenuItem(visibility, Boolean(auth.userId)));

    return (
        <div className="mobile-menu">
            <FontAwesomeIcon
                className="menu-btn"
                icon={faBars}
                onClick={() => setOpen(true)}
            />
            <Drawer
                className="mobile-menu-sidebar"
                anchor={'right'}
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    className: "mobile-menu-sidebar-content",
                }}
            >

                <UserAvatar label={auth.username} />
                {filteredMenuItems.map(({ label, path }, index) =>
                    <Link to={path} key={`menu-item-${index}`} className="menu-item link-secondary">
                        {label}
                    </Link>
                )}
            </Drawer>
        </div>
    );
}
