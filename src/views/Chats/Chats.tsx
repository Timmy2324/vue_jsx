import {Vue, Component} from 'vue-property-decorator';
import {ChatType} from '@/api/api';
import {ActionsChatsTypes} from '@/store/chatsStore';
import { VBtn, VTextField, VContainer, VCard, VFlex, VVirtualScroll } from 'vuetify/lib';
import {ActionsAuthTypes} from "@/store/authStore";
import {debounce} from "@/utils/functions/debounce";
import styles from './chats.module.css';

@Component
export default class Chats extends Vue {

  async created() {
    await Promise.all([
      this.$store.dispatch(ActionsAuthTypes.SET_USER),
      this.$store.dispatch(ActionsChatsTypes.SET_CHATS),
    ])
  }

  get chats() {
    return this.$store.state.chatsStore.chats as ChatType[]
  }

  get inputCreateChat() {
    return this.$store.state.chatsStore.inputCreateChat
  }

  get inputFilterChat() {
    return this.$store.state.chatsStore.inputFilterChat
  }

  async createChat() {
    await this.$store.dispatch(ActionsChatsTypes.ADD_NEW_CHAT)
  }

  async deleteChat(id: number) {
    await this.$store.dispatch(ActionsChatsTypes.DELETE_CHAT, id)
  }

  async onInputCreateChatChange(value: string) {
    await this.$store.dispatch(ActionsChatsTypes.CHANGE_INPUT_CREATE_CHAT_VALUE, value)
  }

  async endScroll() {
    if (!this.$store.state.chatsStore.isEndedChatsOnServer) {
      await this.$store.dispatch(ActionsChatsTypes.ADD_CHATS)
    }
  }

  async onInputFilterChatChange(value: string) {
    await Promise.all([
      this.$store.dispatch(ActionsChatsTypes.CHANGE_INPUT_FILTER_CHAT_VALUE, value),
      this.$store.dispatch(ActionsChatsTypes.SET_CHATS)
    ])
  }

  render() {
    return (
        <VContainer>
          <VCard width="1000" class="pa-7 ma-auto mt-4" elevation="1">
            <h2 class="mb-3">Чаты</h2>
            <VFlex class="d-flex align-center">
              <VTextField
                  solo
                  hide-details="auto"
                  placeholder="Введите название нового чата"
                  value={this.inputCreateChat}
                  onInput={this.onInputCreateChatChange}
              />
              <VBtn class="ml-3" height="48" onEnter={this.createChat} onClick={this.createChat}>Создать</VBtn>
            </VFlex>
            <VTextField
                outlined
                class="mt-3"
                hide-details="auto"
                label="Искать чат"
                value={this.inputFilterChat}
                onInput={debounce(this.onInputFilterChatChange, 500)}
            />
            <div class={[styles.scrollHead, 'd-flex', 'align-center', 'justify-space-between', 'text-lg-h6', 'mt-3', 'mb-2']}>
              <div class={styles.fullWidth}>Название</div>
              <div class={styles.fullWidth}>Сообщения</div>
              <div class={[styles.fullWidth, 'text-end']}></div>
            </div>
            {this.chats.length === 0
                ? <div class="text-center">Чатов пока нет</div>
                : <VVirtualScroll
                    items={this.chats}
                    height="250"
                    item-height="50"
                >
                  {({ item, index }: { item: ChatType, index: number }) => {
                    if (index === this.chats.length - 1) {
                      this.endScroll()
                    }
                    return (
                        <div>
                          <div class={[styles.scrollItem, 'd-flex align-center', 'justify-space-between']} key={item.id}>
                            <div class={styles.fullWidth}>{item.title}</div>
                            <div class={styles.fullWidth}>{item.last_message?.content ?? 'Сообщений пока нет :('}</div>
                            <div class={[styles.fullWidth, 'text-end']}>
                              <VBtn onClick={() => this.deleteChat(item.id)} outlined rounded>
                                Удалить
                              </VBtn>
                            </div>
                          </div>
                          {index === this.chats.length - 1
                              && this.$store.state.chatsStore.isEndedChatsOnServer
                              && <div class="text-center">Показаны все доступные чаты</div>}
                        </div>
                    )
                  }}
                </VVirtualScroll>
            }
          </VCard>
        </VContainer>
    )
  }
}