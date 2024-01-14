import SendbirdChat, { ConnectionHandler, FileCompat, SessionHandler } from "@sendbird/chat";
import config from "../Data/config.json"
import { GroupChannel, GroupChannelHandler, GroupChannelModule, MessageCollection, MessageCollectionEventHandler } from "@sendbird/chat/groupChannel";
import { Constants } from "./Constants";
import moment from 'moment';
import { MessageRequestHandler, MultipleFilesMessageCreateParams, UploadableFileInfo } from "@sendbird/chat/message";
import { GroupChannelHandlerParams } from "@sendbird/chat/lib/__definition";
const { v4 } = require("uuid");

export class SendBirdclss {


    static getFormatedDate(dateStr: any) {
        const momentDate = moment(dateStr, 'YYYY-MM-DD');
        const today = moment();
        const yesterday = moment().subtract(1, 'days');

        if (momentDate.isSame(today, 'day')) {
            return 'Today';
        } else if (momentDate.isSame(yesterday, 'day')) {
            return 'Yesterday';
        } else {
            return momentDate.format('dddd, MMMM Do'); // Fallback for anything beyond the specified range
        }
    }
    static getName(user: any) {
        if (user) {
            return user.FirstName + " " + user.LastName
        }
    }

    static sb: any;
    constructor() {
        SendBirdclss.sb = null;
    }

    static UnixtoTime(unixTime: any, format = 'hh:mm A') {
        let mdate = new Date(unixTime)
        const formatted = moment(mdate).format(format);
        return formatted
    }
    static getTimeStampHourAgo() {
        const now = Date.now();
        // Calculate milliseconds in a week
        const millisecondsInWeek = 1000 * 60 * 60;
        // Get the Unix milliseconds of last week by subtracting
        const lastWeekMillis = now - millisecondsInWeek;
        return lastWeekMillis
    }
    static getProfilePic(user: any) {
        let folderPth = "assets/Users/"
        let pic = Constants.DEFAULT_USER_PROFILE_IMAGE
        if (user) {
            pic = user.ProfilePic ? folderPth + user.ProfilePic : Constants.DEFAULT_USER_PROFILE_IMAGE;
        }
        return pic;
    }
    static getMessages = async (channel: any, timeStamp: any) => {
        try {

            let messagesParams = {
                prevResultSize: 30,
                nextResultSize: 30,
                includeReactions: true,
                includeThreadInfo: true,
                includeParentMessageInfo: true
            }
            let res = await channel.getMessagesByTimestamp(timeStamp, messagesParams)
            return res;
        }
        catch (ex) {
            console.log(ex)
            return undefined;
        }
    }
    static init = () => {
        SendBirdclss.sb = SendbirdChat.init({
            appId: config.APP_ID,
            modules: [new GroupChannelModule()],
        });
        // const connectionHandler = new ConnectionHandler({
        //     onConnected: () => {
        //         console.log("onConnected")
        //     },
        //     onDisconnected: () => {
        //         console.log("onDisconnected")
        //     },
        //     onReconnectStarted: () => {
        //         console.log("onReconnectStarted")
        //     },
        //     onReconnectSucceeded: () => {
        //         console.log("onReconnectSucceeded")
        //     },
        //     onReconnectFailed: () => {
        //         console.log("onReconnectFailed")
        //     },
        //   });

        //   SendBirdclss.sb.addConnectionHandler(v4(), connectionHandler);
    }




    static getUser = async (id: any) => {
        try {
            // The user is connected to Sendbird server.
            const user = await SendBirdclss.sb.connect(id);
            if (user) {
                return user;
            }
        }
        catch (ex) {
            console.log(ex)
            return undefined;
        }
    }

    static getChannel = async (channelurl: any) => {
        try {
            // The user is connected to Sendbird server.         
            const channel = await SendBirdclss.sb.groupChannel.getChannel(channelurl);
            if (channel) {
                return channel;
            }
        }
        catch (ex) {
            console.log(ex)
            return undefined;
        }
    }

    static initMessagesEvents(userStore: any) {

        let myChannel: GroupChannel = userStore.getState().ActiveRoom?.user.userChannel.channel
        if (myChannel) {
            const Gchevents: GroupChannelHandlerParams = {
                onTypingStatusUpdated: (channel: GroupChannel) => {
                    if (channel.url == myChannel.url) { }
                },
                onMessageReceived: (channel: any, message: any) => {
                    if (channel.url == myChannel.url) {
                        userStore.onMessageReceived(message)
                    }
                },
                onMessageUpdated: (channel: any, message: any) => {
                },
                // As messageIds was deprecated since v4.3.1., use messages instead.
                onMessageDeleted: (channel: any, messageIds: any) => {
                    // ...
                }
            }
            let groupChannelHandler = new GroupChannelHandler(Gchevents);

            SendBirdclss.sb.groupChannel.addGroupChannelHandler(v4(), groupChannelHandler)
        }
    }

    static sendMessage = (userStore: any, text: any) => {
        return new Promise((resolve) => {
            let channel: GroupChannel = userStore.getState().ActiveRoom?.user.userChannel.channel
            if (channel) {
                channel.sendUserMessage({ message: text }).onSucceeded((message: any) => {
                    userStore.onMessageSend(message)
                    resolve(1)
                }).onFailed((error: any) => {
                    console.log("Failed to send text message error:" + error)

                });
            }
        })

    }
    static sendFileMessage = (userStore: any, fle: any) => {
        return new Promise((resolve) => {
            let channel: GroupChannel = userStore.getState().ActiveRoom?.user.userChannel.channel
            if (channel) {
                let params: any = {
                    file: fle,
                    thumbnailSizes: [{ maxWidth: 100, maxHeight: 100 }, { maxWidth: 200, maxHeight: 200 }],
                };
                channel.sendFileMessage(params)
                    .onPending((handler: any) => {
                        userStore.onMessageSend(handler)
                        resolve(1)
                    })
                    .onSucceeded((message: any) => {
                        const key = message.reqId
                        this.removePendingMsgs(key)
                        userStore.onMessageSend(message)
                        resolve(1)
                    })

                    .onFailed((error: any) => {
                        console.log("Failed to send file message error:" + error)
                    });
            }
        });
    }

    static removePendingMsgs = (id: any) => {
        let messg = document.getElementById(id);
        if (messg) {
            messg.remove()
        }
    }
    static clearMessageHistory = async (userStore: any) => {
        let channel: GroupChannel = userStore.getState().ActiveRoom?.user.userChannel.channel
        if (channel) {
            let res = await channel.resetMyHistory();
            if (res) {
                userStore.clearHistory();
                return true;
            }

        }
    }



}

