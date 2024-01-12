import axios from "axios"
import config from "./config.json";
import { RequestHeaders } from "./RequestHeaders";

const prefix = "/users";
const url = config.endpointURL;
const headers = RequestHeaders.headers();
export class UsersLayer {
    
    static getActiveChats = async (currentPage: any, pageSize: any, userid = "") => {
        let murl =  `${url}${prefix}?currentPage=${currentPage}&pageSize=${pageSize}${userid != ""?"&userid=" + userid:""}`;       
        let res = await axios.get(murl, headers);
        return res;
    }
    static getById = async (_id: any) => {
        let res = await axios.get(`${url}${prefix}/${_id}`, headers);
        return res;
    }
    static getbyData = async (data: any) => {
        let res = await axios.post(`${url}${prefix}/get`, data, headers);
        return res;
    }

    static Create = async (data: any) => {
        let res = await axios.post(`${url}${prefix}/create`, data, headers);
        return res;
    }
    static Update = async (_id: any, data: any) => {
        let res = await axios.patch(`${url}${prefix}/${_id}`, data, headers);
        return res;
    }
    static Delete = async (_id: any) => {
        let res = await axios.delete(`${url}${prefix}/${_id}`, headers);
        return res;
    }
}