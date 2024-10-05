import { Link } from 'react-router-dom';

import { MobileMenu } from '../MobileMenu/MobileMenu';
import { DesktopMenu } from '../DesktopMenu/DesktopMenu';

import './Header.scss';

export function Header(): JSX.Element {
    return (
        <div className="header">
            <Link className="logo-wrapper" to="/">
               Logo
            </Link>
            <DesktopMenu />
            <MobileMenu />
        </div>
    );
}
