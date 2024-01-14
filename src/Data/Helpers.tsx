import { Constants } from "./Constants";
const moment = require('moment');
export class Helpers {
    static openLink(url: any) {
        window.open(url, "_blank")
    }

    static redirect(history: any, name: any) {
        history.push({ pathname: "/" + name })
    }

    static getProperty = (propertyName: any) => {
        if (window.localStorage) {
            let prop = window.localStorage.getItem(propertyName);
            return prop;
        }
        return "";
    }
    static setProperty = (propertyName: any, propertyValue: any) => {
        if (window.localStorage) {
            window.localStorage.setItem(propertyName, propertyValue);
        }
    }
    static removeProperty = (propertyName: any) => {
        if (window.localStorage) {
            window.localStorage.removeItem(propertyName);
        }
    }

    static setMessagesAnimation = () => {
        document.querySelector('.chat[data-chat=person2]')?.classList.add('active-chat');
        document.querySelector('.person[data-chat=person2]')?.classList.add('active');

        let friends: any = {
            list: document.querySelector('ul.people'),
            all: document.querySelectorAll('.left .person'),
            name: ''
        };

        let chat: any = {
            container: document.querySelector('.container .right'),
            current: null,
            person: null,
            name: document.querySelector('.container .right .top .name')
        };


        friends.all.forEach((f: any) => {
            f.addEventListener('mousedown', () => {
                f.classList.contains('active') || this.setAciveChat(f, friends, chat);
            });
        });


    }

    static setAciveChat = (f: any, friends: any, chat: any) => {
        friends.list?.querySelector('.active')?.classList.remove('active');
        f.classList.add('active');
        chat.current = chat.container?.querySelector('.active-chat');
        chat.person = f.getAttribute('data-chat');
        chat.current.classList.remove('active-chat');
        chat.container.querySelector('[data-chat="' + chat.person + '"]').classList.add('active-chat');
        friends.name = f.querySelector('.name').innerText;
        chat.name.innerHTML = friends.name;
    }



}