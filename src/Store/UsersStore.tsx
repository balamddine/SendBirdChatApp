import { create } from 'zustand';
import { Helpers } from "../Data/Helpers";
import { Constants } from "../Data/Constants";
import { UsersLayer } from "../Data/Datalayer/UsersLayer";
import { SendBirdclss } from '../Data/SendBirdclss';
const usersData: any = Helpers.getProperty(Constants.CMS_USER_TOKEN) ? Helpers.getProperty(Constants.CMS_USER_TOKEN) : null

type IState = {
    isFormLoading: any,
    usersData: any,
    error: any,
    usersL: any,
    currentPage: any,
    pageSize: any,
    maxRowCount: any
    SendBirdData: any
    ActiveRoom: any,
    messagesGroup: any
    
}

const initialState: IState = {
    isFormLoading: false,
    usersData: JSON.parse(usersData),
    error: null,
    SendBirdData: undefined,
    usersL: [],
    maxRowCount: 0,
    currentPage: 1,
    pageSize: Constants.GRID_PAGE_SIZE,
    ActiveRoom: undefined,
    messagesGroup: []
}
type IActions = {
    setCurrentPage: (index: any) => any
    setUsersData: (data: any) => any
    login: (data: any) => any,
    getActiveChats: (pageData: any) => any,
    create: (data: any) => any,
    delete: (data: any) => any,
    logout: () => any,
    getState: () => any
    setActiveRoom: (user: any) => any
    onMessageReceived: (message: any) => any
}

// Define a Zustand store for authentication
const userStore = create<IState & IActions>((set, get) => ({
    ...initialState,
    getState: () => {
        return get();
    },
    setCurrentPage: (index: any) => {
        set({ currentPage: index });
    },
    getSendBirdData: async () => {
        const userid = get().usersData.SendBirdId;
        const user: any = await SendBirdclss.getUser(userid)
        set({ SendBirdData: user });
        return user;
    },

    setUsersData: (data: any) => {
        set({ usersData: data });
    },
    login: async (data: any) => {
        set({ isFormLoading: true }); // Set loading to true before the request
        try {
            const responce: any = await UsersLayer.getbyData(data);
            if(responce.status==200){
                    Helpers.setProperty(Constants.CMS_USER_TOKEN, JSON.stringify(responce.data));
                    set({ usersData: responce.data, isFormLoading: false });
            }
           else{
            set({ usersData: null, error: "can't find user", isFormLoading: false });
           }

        } catch (error) {
            set({ usersData: null, error: error, isFormLoading: false });
        }
    },
    logout: () => {
        Helpers.removeProperty(Constants.CMS_USER_TOKEN);
        set({ usersData: null })
    },
    getActiveChats: async (isAll = false) => {
        set({ isFormLoading: true, usersL: [] });
        try {
            let currentPage = get().currentPage;
            let pageSize = get().pageSize;
            let exclude = get().usersData._id
            const responce = await UsersLayer.getActiveChats(currentPage, pageSize, exclude);
            if (responce.data) {
                let channels = responce.data[0].Channels;
                let users = responce.data[0].Users;
                if (users && users.length > 0) {
                    var results: any = await Promise.all(users.map(async (user: any) => {
                        try {
                            let mChanel = channels.find((x: any) => x.toUserId == user._id);
                            if (mChanel) {
                                let channel = await SendBirdclss.getChannel(mChanel.url);

                                if (channel) {

                                    user["userChannel"] = {
                                        lastMessage: channel.lastMessage,
                                        unreadMessageCount: channel.unreadMessageCount,
                                        channel: channel,

                                    }

                                    let SendbirdUser = await SendBirdclss.getUser(user.SendBirdId);
                                    if (SendbirdUser) {
                                        user["SendbirdUser"] = SendbirdUser;
                                    }
                                    return user;
                                }
                            }
                        }
                        catch (ex) {
                            console.log(ex)
                        }
                    }));                
                    set({ isFormLoading: false, usersL: results, maxRowCount: responce.data.maxRowCount });
                }
            }




        }
        catch (error) {
            set({ usersL: [], error: error, isFormLoading: false }); // Set loading to false on error
        }
    },
    getById: async (_id: any) => {
        set({ isFormLoading: true, usersData: null });
        try {
            const responce = await UsersLayer.getById(_id);
            set({ isFormLoading: false, usersData: responce.data });
        }
        catch (error) {
            set({ usersData: null, error: error, isFormLoading: false }); // Set loading to false on error
        }
    },
    create: async (data: any) => {
        set({ isFormLoading: true });
        data["isDeleted"] = false;
        const responce = await UsersLayer.Create(data);
        set((state: any) => ({
            isFormLoading: false,
            usersL: [...state.usersL, responce.data]
        })
        );
    },
    update: async (_id: any, data: any) => {
        set({ isFormLoading: true });
        const responce = await UsersLayer.Update(_id, data);
        set({ isFormLoading: false });
    },
    delete: async (_id: any) => {
        set({ isFormLoading: true });
        const responce = await UsersLayer.Delete(_id);
        const all = get().usersL
        if (all && all.length > 0) {
            const flterArr = all.filter((x: any) => x._id != _id)
            set({
                isFormLoading: false,
                usersL: flterArr
            });
        }

    },
    setActiveRoom: async (user: any) => {
        if (get().ActiveRoom) { return 1 }
        let hourAgo = SendBirdclss.getTimeStampHourAgo()
        let channel = user.userChannel.channel;
        let messages = await SendBirdclss.getMessages(channel, hourAgo);
        if (messages) {
            user.userChannel.messages = messages
            set({ ActiveRoom: { user: user } })
            return 1;
        }


    },

    onMessageReceived: (message: any) => {
        let activeRoom = get().ActiveRoom
        let allmessages = activeRoom.user.userChannel.messages;
        allmessages.push(message)
        activeRoom.user.userChannel.messages = allmessages;
        set({ ActiveRoom: activeRoom })
    }
}));
export default userStore;





