import React from "react";
import { Message } from 'semantic-ui-react';
interface IProps {
    isError: any
    headerText: any
    bodyText: any
}
interface IState { }
class Messages extends React.Component<IProps, IState> {
    render() {
        return (
            <>
                <div className="messages" >
                    <Message
                        error={this.props.isError}
                        header={this.props.headerText}
                        content={this.props.bodyText}
                    />
                </div>
            </>
        )
    }
}
export default Messages