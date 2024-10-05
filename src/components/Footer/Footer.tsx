import moment from 'moment';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

import './Footer.scss';

export function Footer(): JSX.Element {
    return (
        <div className="footer">
            <div className="copyrights">
                <span className="copyrights-label">
                    &copy; {moment().format('YYYY')} Morgan Polak
                </span>
                <Link to="/contact-us" className="contact-us-link link-tertiary">
                    <FontAwesomeIcon className="contact-us-icon" icon={faEnvelope}/>
                </Link>
            </div>
            <div className="disclaimer">
                The Ethnos title, concept, and rules,
                are the intellectual property of CMON and the game creator,
                Paolo Mori.
            </div>
        </div>
    );
}
