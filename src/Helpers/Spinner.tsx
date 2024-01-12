import React from "react";
import { Icon } from 'semantic-ui-react';
interface IProps {
    size: any
}
interface IState { }
class Spinner extends React.Component<IProps, IState> {
    render() {
        return (
            <>
                <div className="loader" >
                    <Icon loading name='circle notched' size={this.props.size} />
                </div>
            </>
        )
    }
}
export default Spinner