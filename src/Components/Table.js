import React, {Fragment} from 'react';


class Table extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("props: ", this.props.sessions);

        let rows = this.props.sessions.map(session => {
            console.log(session);
            return (
                <Fragment>
                    <tr id={session._fields[0]}>
                        <th key={session._fields[0]}> {session._fields[0]}</th>
                    </tr>
                </Fragment>
            )
        })

        let row = this.props.sessions.map(session => {
            return (
                <th> {session._fields[0]}</th>
            )
        })
        return (
            <div className="ResultsPanelStyles">
            <table>
            <tbody>
            <tr>
                <th> </th>
                {row}
            </tr>
            {rows}
            </tbody>
        </table>
            </div>);
    }

}

export default Table;
