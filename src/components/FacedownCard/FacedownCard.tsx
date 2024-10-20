import logo from '../../assets/ethnos_logo_outlined.png';

import { IFacedownCardProps } from './FacedownCard.types';

import './FacedownCard.scss';

export function FacedownCard(props: IFacedownCardProps): JSX.Element {
    return (
        <div className="facedown-card">
            <div className="card-logo-wrapper">
                {props.showLogo &&
                    <img className="card-logo" src={logo} />
                }
            </div>
        </div>
    );
}
