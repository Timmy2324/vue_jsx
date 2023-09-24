import axios from 'axios';

const baseUrl = '/api/v2';

const instanceApi = axios.create({
    baseURL: baseUrl,
    withCredentials:true,
})

export type UserType = {
    id?: number,
    first_name: string
    second_name: string
    login: string
    email: string
    password: string
    phone: string
    avatar?: string
}

export type ChatType = {
    id: number,
    title: string,
    avatar: string,
    unread_count: number,
    last_message: {
        user: UserType
        time: string,
        content: string,
    }
}

export const AuthAPI = {
    signUp({ first_name, second_name, login, email, password, phone }: UserType) {
        return instanceApi.post<{id: number}>('/auth/signup', {
            first_name,
            second_name,
            login,
            email,
            password,
            phone,
        });
    },
    login(login: string, password: string) {
        return instanceApi.post<void>('/auth/signIn', {
            login,
            password,
        })
    },
    getUser() {
        return instanceApi.get<UserType>('/auth/user')
    },
    logout() {
        return instanceApi.post<void>('/auth/logout')
    },
}

export const ChatsAPI = {
    getChats(offset: number, limit: number, title?: string) {
        return instanceApi.get<ChatType[]>('/chats', {
            params: {
                offset,
                limit,
                title,
            }
        })
    },
    createChat(title: string) {
        return instanceApi.post<void>('/chats', {
            title,
        })
    },
    deleteChat(chatId: number) {
        return instanceApi.delete('/chats', {
            data: {
                chatId,
            }
        })
    }
}