import {ActionTree, Module} from 'vuex';
import {RootState} from '@/store/index';
import {AuthAPI, UserType} from '@/api/api';
import router from '@/router';

export interface IAuthState {
    user: UserType,
    error: string
}

export enum ActionsAuthTypes {
    SET_USER = 'authStore/actions/SET_USER',
    LOGIN = 'authStore/actions/LOGIN',
    CLEAR_ERROR = 'authStore/actions/CLEAR_ERROR',
    LOGOUT = 'authStore/actions/LOGOUT',
    SING_UP = 'authStore/actions/SING_UP',
}

enum MutationsAuthTypes {
    SET_USER = 'authStore/mutations/SET_USER',
    CLEAR_ERROR = 'authStore/mutations/CLEAR_ERROR',
    CLEAR_USER = 'authStore/mutations/CLEAR_USER',
    SING_UP = 'authStore/mutations/SING_UP',
}

const state: IAuthState = {
    user: {} as UserType,
    error: '',
}

const getters = {
    isAuth(state: IAuthState) {
        return !!state.user.id && state.user.id > 0
    }
}

const mutations = {
    [MutationsAuthTypes.SET_USER](state: IAuthState, user: UserType) {
        state.user = user
    },
    [MutationsAuthTypes.CLEAR_ERROR](state: IAuthState) {
        state.error = ''
    },
    [MutationsAuthTypes.CLEAR_USER](state: IAuthState) {
        state.user = {} as UserType
    },
}

const actions: ActionTree<IAuthState, RootState> = {
    [ActionsAuthTypes.SET_USER]({commit}) {
        AuthAPI.getUser()
            .then((res) => {
                commit(MutationsAuthTypes.SET_USER, res.data)
            })
            .catch(() => {
                router.replace('/login')
            })
    },
    [ActionsAuthTypes.LOGIN]({state}, payload) {
        AuthAPI.login(payload.login, payload.password)
            .then(() => {
                router.replace('/chats')
            })
            .catch((err) => {
                state.error = err.response.data.reason
            })
    },
    [ActionsAuthTypes.CLEAR_ERROR]({commit}) {
        commit(MutationsAuthTypes.CLEAR_ERROR)
    },
    [ActionsAuthTypes.LOGOUT]({commit}) {
        AuthAPI.logout()
            .then(() => {
                commit(MutationsAuthTypes.CLEAR_USER)
                router.replace('/login')
            })
    },
    [ActionsAuthTypes.SING_UP]({commit}, payload) {
        AuthAPI.signUp(payload)
            .then(() => {
                commit(MutationsAuthTypes.CLEAR_ERROR)
                router.replace('/chats')
            })
            .catch((err) => {
                state.error = err.response.data.reason
            })
    },
}

export const authStore: Module<IAuthState, RootState> = {
    state,
    getters,
    mutations,
    actions,
    modules: {}
}