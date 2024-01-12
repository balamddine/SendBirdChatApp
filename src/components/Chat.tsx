/* eslint-disable */
import React from "react";
import { Form, Input } from "semantic-ui-react";
import userStore from "../Store/UsersStore";
import { SendBirdclss } from "../Data/SendBirdclss";
import ChannelLastChatMessage from "./Custom/ChannelLastChatMessage";
import ChatMessageGroup from "./Custom/ChatMessageGroup";
interface IProps {
    userStore?: any
}

class Chat extends React.Component<IProps, any> {


    private ismounted = true;
    state = {
        RefreshRoom: false
    }
    componentDidMount() {
        if (!this.ismounted) return;
        this.initChatPage();
    }

    componentWillUnmount() {
        this.ismounted = false
    }

    initChatPage = () => {
        SendBirdclss.init();  
        const { userStore } = this.props;
        userStore.getSendBirdData();
        userStore.getActiveChats();
    }
    handleSearch = () => {

    }
    initChat = async (e: any, user: any) => {
        const { userStore } = this.props;
        this.activateChatStyle(e);
        let resp = await userStore.setActiveRoom(user)
        if (resp) {
            this.scrolltoBottom()
            SendBirdclss.initMessagesEvents(userStore)
            this.setState({ RefreshRoom: true })
        }
    }
    scrolltoBottom = () => {
        let activechatDv = document.querySelector("div.active-chat");
        if (activechatDv) {
            activechatDv.scrollTop = activechatDv.scrollHeight;
        }
    }
    activateChatStyle = (e: any) => {
        let friends: any = document.querySelector('ul.people');
        friends.querySelector('.active')?.classList.remove('active');
        e.currentTarget.classList.add('active');


    }
    render() {
        const { userStore } = this.props;
        const nickname = userStore.usersData.Username ? userStore.usersData.Username : "";
        const imgUrl = SendBirdclss.getProfilePic(userStore.usersData)

        return (
            <>

                <div className="wrapper">
                    <div className="container">
                        <div className="leftContainer">
                            <div className="top">
                                <div className="userInfo">
                                    <img src={imgUrl} alt={nickname} />
                                </div>
                                <div className="search">
                                    <Form onSubmit={this.handleSearch} >
                                        <Form.Input
                                            name="search"
                                            placeholder='Search or start new chat'
                                            control={Input}
                                            icon='search'
                                            iconPosition='left'
                                        >
                                        </Form.Input>
                                    </Form>
                                </div>

                            </div>
                            <ul className="people">
                                {

                                    (userStore.usersL && userStore.usersL.length > 0) ?

                                        userStore.usersL.map((user: any, index: any) => {
                                            if (user) {
                                                const key = `person_${index}`
                                                const pic = SendBirdclss.getProfilePic(user)
                                                const mTime: any = SendBirdclss.UnixtoTime(user.userChannel?.lastMessage.createdAt)
                                                return (
                                                    <li className="person" data-chat={key} key={key} onClick={(e) => this.initChat(e, user)}>
                                                        <img src={pic} alt={user.Username} />
                                                        <span className="name">{user.Username}</span>
                                                        <span className="time">{mTime}</span>
                                                        <span className="preview">
                                                            <ChannelLastChatMessage
                                                                Message={user.userChannel?.lastMessage}
                                                            />
                                                        </span>
                                                    </li>
                                                )
                                            }
                                        }) :
                                        <div className="startChatMessage">
                                            <span className="preview centered">Start a new chat</span>
                                        </div>
                                }

                            </ul>
                        </div>

                        <div className="rightContainer">

                            {
                                userStore.ActiveRoom ? (

                                    <>
                                        <div className="top"><span>To: <span className="name">{userStore.ActiveRoom.user.Username}</span></span></div>
                                        <div className="chat active-chat">
                                            <ChatMessageGroup />
                                        </div>
                                        <div className="write">
                                            <a href="#" className="write-link attach"></a>
                                            <input type="text" />
                                            <a href="#" className="write-link smiley"></a>
                                            <a href="#" className="write-link send"></a>
                                        </div>
                                    </>
                                ) :
                                    <div className="welcomeScreen">
                                        <span className="preview centered">Start a chat by clicking on a user</span>
                                    </div>
                            }


                        </div>
                    </div>
                </div>
            </>
        )
    }
}
const withStore = (BaseComponent: any) => (props: any) => {
    const userS = userStore();
    return <BaseComponent {...props} userStore={userS} />;
};
export default withStore(Chat)