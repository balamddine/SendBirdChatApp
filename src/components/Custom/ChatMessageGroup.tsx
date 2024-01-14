/* eslint-disable */
import React from "react";
import { SendBirdclss } from "../../Data/SendBirdclss";
import ChatMessage from "./ChatMessage";
import userStore from "../../Store/UsersStore";
interface IProps {
    userStore?: any
}
class ChatMessageGroup extends React.Component<IProps, any> {
    private ismounted = true;
   
    componentDidMount() {
        if (!this.ismounted) return;
    }
    getMessageGroups = () => {
        const { userStore } = this.props;
        const Messages = userStore.getState().ActiveRoom.user.userChannel.messages;
        if (!Messages) return;
        const groups = Messages.reduce((groups: any, message: any) => {
            const date = SendBirdclss.UnixtoTime(message.createdAt, "YYYY-MM-DD");
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
            return groups;
        }, {});

        const groupArrays = Object.keys(groups).map((date) => {
            return {
                date,
                messages: groups[date]
            };
        });
        return groupArrays
    }
    componentWillUnmount() {
        this.ismounted = false
    }
    render() {
        const { userStore } = this.props;
        const MeSendBirdId = userStore.usersData.SendBirdId;
        const messagesGroup = this.getMessageGroups();
        if (messagesGroup && messagesGroup.length > 0) {
            return (

                messagesGroup.map((group: any, index: any) => {
                    let formatedDate: any = SendBirdclss.getFormatedDate(group.date);
                    return (
                        <div key={`group_${index}`}>
                            <div className="conversation-start" >
                                <span>{formatedDate}</span>
                            </div>
                            {
                                (group.messages && group.messages.length > 0) ? (
                                    group.messages.map((message: any, index: any) => {
                                        return (
                                            <ChatMessage
                                                Message={message}
                                                MeSendBirdId={MeSendBirdId}
                                                key={`message_${index}`}
                                            />

                                        )
                                    })
                                ) : (<div>No messages found!</div>)
                            }
                        </div>

                    )
                })
            )
        }
        return <></>
    }
}
const withStore = (BaseComponent: any) => (props: any) => {
    const userS = userStore();
    return <BaseComponent {...props} userStore={userS} />;
};
export default withStore(ChatMessageGroup)
