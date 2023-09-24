import {Vue, Component, Ref} from 'vue-property-decorator';
import {ActionsAuthTypes} from '@/store/authStore';
import {clearAuthError} from '@/utils/functions/clearAuthError';
import { VBtn, VTextField, VContainer, VCard, VFlex, VForm } from 'vuetify/lib';

@Component
export default class SingIn extends Vue {
  @Ref() readonly form?: HTMLElement & { validate: () => boolean }

  rulesError = [(value: string) => !!value || 'Это поле является обязательным']

  loginForm = {
    login: '',
    password: '',
  }

  get error() {
    return this.$store.state.authStore.error
  }

  async login() {
    if (this.form?.validate()) {
      await this.$store.dispatch(ActionsAuthTypes.LOGIN, this.loginForm)
    }
  }

  async singUp() {
    await Promise.all([
      this.$store.dispatch(ActionsAuthTypes.CLEAR_ERROR),
      this.$router.replace('/sing-up'),
    ])
  }

  inputChange(value: string, fieldName: keyof typeof this.loginForm) {
    clearAuthError()
    this.loginForm[fieldName] = value
  }

  render() {
    return (
        <VContainer>
          <VCard width="400" class="pa-7 ma-auto mt-4" elevation="1">
            <h2>Вход</h2>
            <VForm ref="form">
                <VTextField
                    label="Логин"
                    required
                    rules={this.rulesError}
                    value={this.loginForm.login}
                    onInput={(value: string) => {
                        this.inputChange(value, 'login')
                    }}
                />
                <VTextField
                    type="password"
                    label="Пароль"
                    required
                    rules={this.rulesError}
                    value={this.loginForm.password}
                    onInput={(value: string) => {
                        this.inputChange(value, 'password')
                    }}
                />
                <VFlex class="flex-column text-center">
                    <VBtn class="mt-3" onClick={this.login}>Войти</VBtn>
                    <div class="error--text mt-3">{ this.error }</div>
                    <VBtn class="ma-auto mt-3" text onClick={this.singUp}>Регистрация</VBtn>
                </VFlex>
            </VForm>
          </VCard>
        </VContainer>
    )
  }
}