import {Vue, Component} from 'vue-property-decorator';
import logo from '@/assets/logo/logo.svg';
import {ActionsAuthTypes} from "@/store/authStore";
import { VBtn, VAppBar, VSpacer, VCard } from 'vuetify/lib';

@Component
export default class Header extends Vue {

  get isAuth() {
    return this.$store.getters.isAuth
  }

  async logout() {
    await this.$store.dispatch(ActionsAuthTypes.LOGOUT)
  }

  render() {
    return (
        <VCard tile>
          <VAppBar elevation="1">
            <a class="d-flex align-center font-weight-bold text-lg-h6 black--text">
              <img class="mr-2" src={logo} alt="logo"/>
              Chats
            </a>
            <VSpacer></VSpacer>
            {this.isAuth && <VBtn text onClick={this.logout} title="Выйти">Выйти</VBtn>}
          </VAppBar>
        </VCard>
    )
  }
}