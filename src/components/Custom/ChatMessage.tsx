/* eslint-disable */
import React from "react";
import { Icon } from 'semantic-ui-react'
interface IProps {
    Message: any,
    MeSendBirdId: any
}
class ChatMessage extends React.Component<IProps, any> {
    private ismounted = true;

    componentDidMount() {
        if (!this.ismounted) return;
    }

    componentWillUnmount() {
        this.ismounted = false
    }
    render() {
        const { Message, MeSendBirdId } = this.props;
        const isAdminMessage = Message.messageType == "admin"
        let cls = "";
        if (isAdminMessage) {
            cls = "admin"
        } 
        else {
            if (Message.sender.userId == MeSendBirdId) {
                cls = "me"
            }
            else {
                cls = "you"
            }
        }
        if (Message.message) {
            return (
                <div className={`bubble ${cls}`}>
                    {
                        isAdminMessage && (
                            <Icon name='announcement' /> 
                        )
                    }
                    {Message.message}
                    <div className="time">
                        12:40 PM
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className={`bubble ${cls}`}>
                    <Icon name='file' /> file
                </div>
            )
        }
    }
}
export default ChatMessage