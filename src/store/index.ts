import Vue from 'vue'
import Vuex, {Store} from 'vuex'
import {chatsStore, IChatsState} from '@/store/chatsStore'
import {authStore, IAuthState} from '@/store/authStore';

Vue.use(Vuex)

export type RootState = {
  chatsStore: IChatsState
  authStore: IAuthState
};

export const store: Store<RootState> = new Vuex.Store({
  state: {
  } as RootState,
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    chatsStore,
    authStore,
  }
})
