import { selectOne, fetchFunction } from './_functions'
import validateForm from './_validate-forms'
import timer from './_timer'

export default async function () {
   try {
      const loginCard = selectOne('#login-card'),
         loginPhoneForm = selectOne('#login-phone-form'),
         loginPhoneInput = loginPhoneForm.querySelector('#phone'),
         loginPhoneSubmit = loginPhoneForm.querySelector('.button-blue')

      loginPhoneForm.addEventListener('submit', async e => {
         e.preventDefault()

         loginPhoneSubmit.setAttribute('data-loading', true)
         loginPhoneSubmit.setAttribute('disabled', true)

         let response = await fetchFunction('/users/login', 'POST', {
            phone: loginPhoneInput.value.substring(1).replace(/ /g, '')
         })

         console.log(response)

         if (response.ok) {
            loginCard.innerHTML = `
                 <h2>Авторизация</h2>
                 <form class="auth__form" id="login-code-form">
                     <label class="auth-label">
                         <span>Код</span>
                         <input class="input" type="text" id="code" name="code" minlength="5" maxlength="5" data-code="true" placeholder="Введите смс код">
                     </label>
                     <button class="button-blue" type="submit" disabled>
                         Войти
                         <img class="loading-spinner" src="/images/icons/spinner.svg" alt="loading spinner">
                     </button>
                     <a class="button-outline" href="/users/signup">Зарегистрироваться</a>
                 </form>
            `
            validateForm()
            sendCode(response.codeValidationId)
         }

         if (!response.ok) {
            loginPhoneSubmit.removeAttribute('data-loading')
            loginPhoneSubmit.setAttribute('disabled', true)

            let errorMessage

            if (response.message === 'Error: invalid phone') {
               errorMessage = 'Введен неправильный номер'
            }

            if (response.message === 'Error: User is not registered') {
               errorMessage = 'Вы раньше не регистрировались. Пожалуйста, зарегистрируйтесь'
            }

            if (response.message.indexOf('You have banned') !== -1) {
               const deadline = new Date(response.message.substring(29))
               const time = Math.floor((deadline - new Date()) / 1000)
               if (!loginPhoneForm.firstElementChild.classList.contains('alert-danger')) {
                  let alertDanger = document.createElement('div')
                  alertDanger.classList.add('alert-danger')
                  alertDanger.innerHTML = `
                     <p>Пожалуйста, попробуйте еще раз после <time></time></p>
                  `
                  loginPhoneForm.prepend(alertDanger)
                  timer('.alert-danger time', time)
               } else {
                  loginPhoneForm.firstElementChild.innerHTML = `
                     <p>Пожалуйста, попробуйте еще раз после <time></time></p>
                  `
                  timer('.alert-danger time', time)
               }
               return 0
            }

            if (!loginPhoneForm.firstElementChild.classList.contains('alert-danger')) {
               let alertDanger = document.createElement('div')
               alertDanger.classList.add('alert-danger')
               alertDanger.textContent = errorMessage
               loginPhoneForm.prepend(alertDanger)
            } else {
               loginPhoneForm.firstElementChild.textContent = errorMessage
            }
         }
      })

      function sendCode(codeValidationId) {
         const loginCodeForm = selectOne('#login-code-form'),
            loginCodeInput = loginCodeForm.querySelector('#code'),
            loginCodeSubmit = loginCodeForm.querySelector('.button-blue')

         loginCodeForm.addEventListener('submit', async e => {
            e.preventDefault()

            loginCodeSubmit.setAttribute('data-loading', true)
            loginCodeSubmit.setAttribute('disabled', true)

            let response = await fetch('/users/validate-code', {
               headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                  'code-validation-id': codeValidationId
               },
               method: 'POST',
               body: JSON.stringify({
                  code: loginCodeInput.value
               })
            })

            response = await response.json()

            console.log(response)

            if (response.ok) {
               window.location.href = '/'
            }

            if (!response.ok) {
               loginCodeSubmit.removeAttribute('data-loading')
               loginCodeSubmit.setAttribute('disabled', true)

               let errorMessage

               if (response.message === 'Error: invalid code' || response.message === 'Error: Validation code is incorrect') {
                  errorMessage = 'Код неверный'
               } else if (response.message.indexOf('Validation code is not found') !== -1) {
                  errorMessage = 'Много ошибочных попыток'
                  setTimeout(() => {
                     window.location.href = '/users/login'
                  }, 2000)
               }

               if (!loginCodeForm.firstElementChild.classList.contains('alert-danger')) {
                  let alertDanger = document.createElement('div')
                  alertDanger.classList.add('alert-danger')
                  alertDanger.textContent = errorMessage
                  loginCodeForm.prepend(alertDanger)
               } else {
                  loginCodeForm.firstElementChild.textContent = errorMessage
               }
            }
         })
      }
   } catch (e) {

   }
}