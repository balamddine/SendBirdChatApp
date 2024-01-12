/* eslint-disable */
import React from "react";
import { Icon } from 'semantic-ui-react'
interface IProps {
    Message: any
}
class ChannelLastChatMessage extends React.Component<IProps,any> {
    private ismounted = true;

    componentDidMount() {
        if (!this.ismounted) return;
    }

    componentWillUnmount() {
        this.ismounted = false
    }
    render() {
        const { Message } = this.props;
        if (Message.message) {
            return (<p>{Message.message}</p>);
        }
        else {
            return (<p><Icon name='file' /> file</p>);
        }
    }
}
export default ChannelLastChatMessage