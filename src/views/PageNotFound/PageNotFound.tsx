import {Vue, Component} from 'vue-property-decorator';
import { VBtn } from 'vuetify/lib';
import styles from './pageNotFound.module.css';

@Component
export default class PageNotFound extends Vue {


    render() {
        return (
            <div class={styles.errorWrapper}>
                <div class={`${styles.text404} ${styles.gradient}`}>404</div>
                <div class={`${styles.notFound} ${styles.gradient}`}>Page not found!</div>
                <div class={`${styles.picture} ${styles.gradient}`}>—ฅ/ᐠ.̫ .ᐟ\ฅ—</div>
                <VBtn class="mt-5" onClick={() => this.$router.replace('/chats')}>Вернуться к чатам</VBtn>
            </div>
        )
    }
}