import {ActionsAuthTypes} from '@/store/authStore';
import {store} from '@/store';

export function clearAuthError() {
    !!store.state.authStore.error && store.dispatch(ActionsAuthTypes.CLEAR_ERROR)
}