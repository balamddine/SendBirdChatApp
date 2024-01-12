/* eslint-disable */
import React from "react";
import { Button, ButtonContent, Form, Icon, Input } from "semantic-ui-react";
import userStore from "../Store/UsersStore";
import { SendBirdclss } from "../Data/SendBirdclss";
import ChannelLastChatMessage from "./Custom/ChannelLastChatMessage";
import ChatMessageGroup from "./Custom/ChatMessageGroup";
import Spinner from "../Helpers/Spinner";
interface IProps {
    userStore?: any
}

class Chat extends React.Component<IProps, any> {


    private ismounted = true;
    state = {
        sendLoader: false
    }
    componentDidMount() {
        if (!this.ismounted) return;
        this.initChatPage();
    }

    componentWillUnmount() {
        this.ismounted = false
    }

    initChatPage = async () => {
        SendBirdclss.init();
        const { userStore } = this.props;
        const user = await userStore.getSendBirdData();
        if (user) {
            userStore.getActiveChats();
        }

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

        }
    }
    scrolltoBottom = () => {
        let activechatDv: any = document.querySelector("div.active-chat");
        if (activechatDv) {
            activechatDv.scrollTop = activechatDv.scrollHeight + 500;

        }
    }
    activateChatStyle = (e: any) => {
        let friends: any = document.querySelector('ul.people');
        friends.querySelector('.active')?.classList.remove('active');
        e.currentTarget.classList.add('active');


    }
    onInputCapture = (e: any) => {
        let message_text: any = document.querySelector('div.message_text')
        let text = message_text.innerText
        let placeholder: any = document.querySelector('div.placeholder');
        if (placeholder) {
            if (text == "") {
                placeholder.classList.remove('hide');
            }
            else {
                placeholder.classList.add('hide');

            }

        }
    }
    onKeyDown = (e: any) => {
        if (e.keyCode == 13) {
            this.sendMessage()
            e.preventDefault();
        }
    }
    restInput = (message_text: any) => {

        this.scrolltoBottom()
        message_text.innerText = ""
        let placeholder: any = document.querySelector('div.placeholder');
        placeholder.classList.remove('hide');
    }
    sendMessage = async () => {
        this.setState({ sendLoader: true })
        const { userStore } = this.props;
        let message_text: any = document.querySelector('div.message_text')
        let text = message_text.innerText;
        if (!text) return;
        let res = await SendBirdclss.sendMessage(userStore, text)
        if (res == 1) {
            this.restInput(message_text)
            this.setState({ sendLoader: false })
        }
    }
    render() {
        const { userStore } = this.props;
        const nickname = userStore.usersData.Username ? userStore.usersData.Username : "";
        const imgUrl = SendBirdclss.getProfilePic(userStore.usersData)
        const ToimgUrl = SendBirdclss.getProfilePic(userStore.ActiveRoom ? userStore.ActiveRoom.user : undefined)
        const Toname = SendBirdclss.getName(userStore.ActiveRoom ? userStore.ActiveRoom.user : undefined)

        if (userStore.isChatRoomLoading) {
            return (
                <div className="centered">
                    <Spinner size="large" />
                </div>

            )
        }


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
                                                const name = SendBirdclss.getName(user)
                                                const mTime: any = SendBirdclss.UnixtoTime(user.userChannel?.lastMessage.createdAt)
                                                return (
                                                    <li className="person" data-chat={key} key={key} onClick={(e) => this.initChat(e, user)}>
                                                        <img src={pic} alt={user.Username} />
                                                        <span className="name">{name}</span>
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
                                        <div className="top">
                                            <div className="person noPad noBackground">
                                                <img src={ToimgUrl} alt={userStore.ActiveRoom.user.Username} />
                                                <span className="name">{Toname}</span>
                                            </div>
                                        </div>
                                        <div className="chat active-chat">
                                            <ChatMessageGroup />
                                        </div>
                                        <div className="write">
                                            <div className="smiley" >
                                                <Button icon circular>
                                                    <Icon name='smile outline' />
                                                </Button>
                                            </div>
                                            <div className="attachement">
                                                <Button icon circular>
                                                    <Icon name='attach' />
                                                </Button>
                                            </div>
                                            <div className="message_Input">
                                                <div className="message_wrapper">
                                                    <div className="message_text" contentEditable onInputCapture={this.onInputCapture} onKeyDown={this.onKeyDown}>
                                                    </div>
                                                    <div className="placeholder">Type a message</div>
                                                </div>
                                            </div>
                                            <div className="send">
                                                <Button animated='vertical' circular onClick={this.sendMessage} loading={this.state.sendLoader}>
                                                    <Icon name='send' />
                                                </Button>
                                            </div>

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