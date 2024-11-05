import { Link } from 'react-router-dom';

import { MobileMenu } from '../MobileMenu/MobileMenu';
import { DesktopMenu } from '../DesktopMenu/DesktopMenu';
import logo from '../../assets/logos/ethnos_logo.png';

import './Header.scss';

export function Header(): JSX.Element {
    return (
        <div className="header">
            <div className="logo-wrapper">
                <Link to="/">
                    <img
                        className="logo"
                        src={logo}
                        alt="Ethnos Logo"
                        title="Ethnos Logo"
                    />
                </Link>
            </div>
            <DesktopMenu />
            <MobileMenu />
        </div>
    );
}
