import {Vue, Component, Ref} from 'vue-property-decorator';
import {ActionsAuthTypes} from '@/store/authStore';
import {clearAuthError} from '@/utils/functions/clearAuthError';
import { VBtn, VTextField, VContainer, VCard, VFlex, VForm } from 'vuetify/lib';


@Component
export default class SingUp extends Vue {
  @Ref() readonly form?: HTMLElement & { validate: () => boolean }

  rulesError = [(value: string) => !!value || 'Это поле является обязательным']

  singUpForm = {
    first_name: '',
    second_name: '',
    login: '',
    email: '',
    password: '',
    phone: '',
  }

  get error() {
    return this.$store.state.authStore.error
  }

  async singUp() {
    if (this.form?.validate()) {
      await this.$store.dispatch(ActionsAuthTypes.SING_UP, this.singUpForm)
    }
  }

  async login() {
    await Promise.all([
      this.$store.dispatch(ActionsAuthTypes.CLEAR_ERROR),
      this.$router.replace('/login'),
    ])
  }

  inputChange(value: string, fieldName: keyof typeof this.singUpForm) {
    clearAuthError()
    this.singUpForm[fieldName] = value
  }

  render() {
    return (
        <VContainer>
          <VCard width="400" class="pa-7 ma-auto mt-4" elevation="1">
            <h2>Регистрация</h2>
            <VForm ref="form" >
                <VTextField
                    label="Имя"
                    required
                    rules={this.rulesError}
                    value={this.singUpForm.first_name}
                    onInput={(value: string) => {
                        this.inputChange(value, 'first_name')
                    }}
                />
                <VTextField
                    label="Фамилия"
                    required
                    rules={this.rulesError}
                    value={this.singUpForm.second_name}
                    onInput={(value: string) => {
                        this.inputChange(value, 'second_name')
                    }}
                />
                <VTextField
                    label="Логин"
                    required
                    rules={this.rulesError}
                    value={this.singUpForm.login}
                    onInput={(value: string) => {
                        this.inputChange(value, 'login')
                    }}
                />
                <VTextField
                    type="email"
                    required
                    rules={this.rulesError}
                    label="Емаил"
                    value={this.singUpForm.email}
                    onInput={(value: string) => {
                        this.inputChange(value, 'email')
                    }}
                />
                <VTextField
                    type="password"
                    required
                    rules={this.rulesError}
                    label="Пароль"
                    value={this.singUpForm.password}
                    onInput={(value: string) => {
                        this.inputChange(value, 'password')
                    }}
                />
                <VTextField
                    type="tel"
                    required
                    rules={this.rulesError}
                    label="Телефон"
                    value={this.singUpForm.phone}
                    onInput={(value: string) => {
                        this.inputChange(value, 'phone')
                    }}
                />
                <VFlex class="flex-column text-center">
                    <VBtn class="mt-3 ma-auto" onClick={this.singUp}>Зарегистрироваться</VBtn>
                    <div class="error--text mt-3">{ this.error }</div>
                    <VBtn class="mt-3" text onClick={this.login}>Войти</VBtn>
                </VFlex>
            </VForm>
          </VCard>
        </VContainer>
    )
  }
}