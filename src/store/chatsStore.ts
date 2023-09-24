import {ChatsAPI, ChatType} from '@/api/api';
import {ActionTree, Module} from 'vuex';
import {RootState} from "@/store/index";

export interface IChatsState {
    offset: number,
    limit: number,
    chats: ChatType[],
    inputCreateChat: string,
    inputFilterChat: string,
    isEndedChatsOnServer: boolean,
}

export enum ActionsChatsTypes {
    SET_CHATS = 'chatsStore/actions/SET_CHATS',
    ADD_CHATS = 'chatsStore/actions/ADD_CHATS',
    ADD_NEW_CHAT = 'chatsStore/actions/ADD_NEW_CHAT',
    DELETE_CHAT = 'chatsStore/actions/DELETE_CHAT',
    CHANGE_INPUT_CREATE_CHAT_VALUE = 'chatsStore/actions/CHANGE_INPUT_CREATE_CHAT_VALUE',
    CHANGE_INPUT_FILTER_CHAT_VALUE = 'chatsStore/actions/CHANGE_INPUT_FILTER_CHAT_VALUE',
}

enum MutationsChatsTypes {
    INCREMENT_OFFSET = 'chatsStore/mutations/INCREMENT_OFFSET',
    SET_ZERO_OFFSET = 'chatsStore/mutations/SET_ZERO_OFFSET',
    CHANGE_INPUT_CREATE_CHAT_VALUE = 'chatsStore/mutations/CHANGE_INPUT_CREATE_CHAT_VALUE',
    CHANGE_INPUT_FILTER_CHAT_VALUE = 'chatsStore/mutations/CHANGE_INPUT_FILTER_CHAT_VALUE',
    SET_CHATS = 'chatsStore/mutations/SET_CHATS',
    ADD_CHATS = 'chatsStore/mutations/ADD_CHATS',
    ENDED_CHATS_ON_SERVER = 'chatsStore/mutations/ENDED_CHATS_ON_SERVER',
}

const state: IChatsState = {
    offset: 0,
    limit: 10,
    chats: [],
    inputCreateChat: '',
    inputFilterChat: '',
    isEndedChatsOnServer: false
}

const getters =  {

}

const mutations = {
    [MutationsChatsTypes.INCREMENT_OFFSET](state: IChatsState) {
        state.offset++
    },
    [MutationsChatsTypes.SET_ZERO_OFFSET](state: IChatsState) {
        state.offset = 0
    },
    [MutationsChatsTypes.CHANGE_INPUT_CREATE_CHAT_VALUE](state: IChatsState, value: string) {
        state.inputCreateChat = value
    },
    [MutationsChatsTypes.CHANGE_INPUT_FILTER_CHAT_VALUE](state: IChatsState, value: string) {
        state.inputFilterChat = value
    },
    [MutationsChatsTypes.ADD_CHATS](state: IChatsState, chats: ChatType[]) {
        state.chats.push(...chats)
    },
    [MutationsChatsTypes.SET_CHATS](state: IChatsState, chats: ChatType[]) {
        state.chats = chats
    },
    [MutationsChatsTypes.ENDED_CHATS_ON_SERVER](state: IChatsState, isEnded: boolean) {
        state.isEndedChatsOnServer = isEnded
    },
}

const actions: ActionTree<IChatsState, RootState> = {
    [ActionsChatsTypes.SET_CHATS]({state, commit}) {
        commit(MutationsChatsTypes.ENDED_CHATS_ON_SERVER, false)
        commit(MutationsChatsTypes.SET_CHATS, [])
        ChatsAPI.getChats(0, state.limit, state.inputFilterChat)
            .then((res) => {
                commit(MutationsChatsTypes.SET_CHATS, res.data)
                if (res.data.length < state.limit) {
                    commit(MutationsChatsTypes.ENDED_CHATS_ON_SERVER, true)
                }
                commit(MutationsChatsTypes.SET_ZERO_OFFSET)
                commit(MutationsChatsTypes.INCREMENT_OFFSET)
            })
            .catch((err) => {
                console.log(err)
            })
    },
    [ActionsChatsTypes.ADD_CHATS]({state, commit}) {
        ChatsAPI.getChats(state.offset * state.limit, state.limit, state.inputFilterChat)
            .then((res) => {
                commit(MutationsChatsTypes.ADD_CHATS, res.data)
                if (res.data.length < state.limit) {
                    commit(MutationsChatsTypes.ENDED_CHATS_ON_SERVER, true)
                }
                commit(MutationsChatsTypes.INCREMENT_OFFSET)
            })
            .catch((err) => {
                console.log(err)
            })
    },
    [ActionsChatsTypes.CHANGE_INPUT_CREATE_CHAT_VALUE]({commit}, value: number) {
        commit(MutationsChatsTypes.CHANGE_INPUT_CREATE_CHAT_VALUE, value)
    },
    [ActionsChatsTypes.CHANGE_INPUT_FILTER_CHAT_VALUE]({commit}, value: number) {
        commit(MutationsChatsTypes.CHANGE_INPUT_FILTER_CHAT_VALUE, value)
    },
    [ActionsChatsTypes.ADD_NEW_CHAT]({state, commit, dispatch}) {
        ChatsAPI.createChat(state.inputCreateChat)
            .then(() => {
                commit(MutationsChatsTypes.CHANGE_INPUT_CREATE_CHAT_VALUE, '')
                dispatch(ActionsChatsTypes.SET_CHATS)
            })
            .catch((err) => {
                console.log(err)
            })
    },
    [ActionsChatsTypes.DELETE_CHAT]({dispatch}, id: number) {
        ChatsAPI.deleteChat(id)
            .then(() => {
                dispatch(ActionsChatsTypes.SET_CHATS)
            })
            .catch((err) => {
                console.log(err)
            })
    },
}

export const chatsStore: Module<IChatsState, RootState> = {
    state,
    getters,
    mutations,
    actions,
    modules: {}
}