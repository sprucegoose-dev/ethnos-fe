import { IBandPointsTableProps } from './BandPointsTable.types';
import './BandPointsTable.scss';

export function BandPointsTable(_props: IBandPointsTableProps): JSX.Element {

    const bandValues: { [key: number]: number } = {
        1: 0,
        2: 1,
        3: 3,
        4: 6,
        5: 10,
        6: 15
    };
    return (
        <table className="table band-points-table">
                <thead>
                    <tr>
                        <th className="row-header">
                            Band Size
                        </th>
                        {
                            Object.keys(bandValues).map((bandSize) =>
                                <th key={`table-header-${bandSize}`}>
                                    {bandSize}{Number(bandSize) === 6 ? '+' : ''}
                                </th>
                            )
                        }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="row-header">
                            Points
                        </td>
                        {
                            Object.values(bandValues).map((points) =>
                                <th key={`table-cell-${points}`}>
                                    {points}
                                </th>
                            )
                        }
                    </tr>
                </tbody>
            </table>
    );
}
