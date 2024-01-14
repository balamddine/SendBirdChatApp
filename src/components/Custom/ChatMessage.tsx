/* eslint-disable */
import React from "react";
import { Icon } from 'semantic-ui-react'
import { SendBirdclss } from "../../Data/SendBirdclss";
import { Constants } from "../../Data/Constants";
import Spinner from "../../Helpers/Spinner";
import { Helpers } from "../../Data/Helpers";
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
        const key = Message.reqId
        const type = Message.messageType
        const isAdminMessage = type == "admin"
        const isImage = Message.type && Message.type.includes("image") //MimeType
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
                <div className={`bubble ${cls}`} id={key} key={key}>
                    {
                        isAdminMessage && (
                            <Icon name='announcement' />
                        )
                    }
                    {Message.message}
                    <div className="time">
                        {SendBirdclss.UnixtoTime(Message.createdAt)}
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className={`bubble ${cls}`} id={key} key={key}>
                    {
                        isAdminMessage && (
                            <Icon name='announcement' />
                        )
                    }
                    {
                        <>
                            {
                                <div className={`fileMsg ${isImage?"isImage":""}`} onClick={() => { Helpers.openLink(Message.url) }}>
                                    <div className="holder">
                                        {
                                            isImage ? (
                                                <span className="name">
                                                    <img src={Message.url} alt={Message.name} style={{ maxWidth: "100%" }} />
                                                </span>
                                            ) :
                                                (
                                                    <>
                                                        <span className="fileType">
                                                            <Icon name="file" size="big" />
                                                        </span>
                                                        <span className="name">
                                                            {Message.name}
                                                        </span>
                                                    </>
                                                )
                                        }
                                       
                                        <span className="download">
                                            {
                                                Message.sendingStatus == "pending" ? <Spinner size="large" /> : !isImage && <Icon name="download" size="small" />
                                            }
                                        </span>
                                    </div>
                                </div>
                            }
                            <div className="time">
                                {SendBirdclss.UnixtoTime(Message.createdAt)}
                            </div>
                        </>

                    }

                </div>
            )
        }
    }
}
export default ChatMessage