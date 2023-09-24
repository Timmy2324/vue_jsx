import {Vue, Component} from 'vue-property-decorator';
import Header from '@/utils/components/Header/Header';
import { VApp, VMain } from 'vuetify/lib'

@Component
export default class App extends Vue {

  render() {
    return (
        <VApp id="app">
          <Header/>
          <VMain>
            <router-view/>
          </VMain>
        </VApp>
    )
  }
}
