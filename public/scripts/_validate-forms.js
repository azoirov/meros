import {selectOne, removeClass, addClass} from './_functions'

export default function validateForm() {
   try {
      const authForm = selectOne('.auth__form'),
         authInputs = authForm.querySelectorAll('input'),
         authSubmitBtn = authForm.querySelector('button')

      authInputs.forEach(input => {
         input.addEventListener('paste', e => {
            e.preventDefault()
         })
      })

      authInputs.forEach(input => {
         input.addEventListener('input', e => {
            let currentInput = e.target, currentInputType = currentInput.getAttribute('type'),
               currentInputValue = e.target.value.replace(/ /gi, '')

            function makeInputValid() {
               addClass(currentInput, 'valid')
               removeClass(currentInput, 'invalid')
               if (currentInput.nextElementSibling.classList.contains('validation-warning')) {
                  currentInput.nextElementSibling.remove()
               }
            }

            function makeInputInvalid(warningText) {
               removeClass(currentInput, 'valid')
               addClass(currentInput, 'invalid')
               if (!currentInput.nextElementSibling) {
                  currentInput.insertAdjacentHTML('afterend', `<span class="validation-warning">${warningText}</span>`)
               }
            }

            if (currentInputType === 'tel') {
               const companyCodes = ['33', '91', '90', '95', '88', '97', '99', '98', '93', '94', '92'],
                  companyCode = currentInputValue.substr(4, 2)
               if (/^998[389][01345789][0-9]{7}$/.test(currentInputValue.substring(1)) && companyCodes.includes(companyCode)) {
                  makeInputValid()
               } else {
                  makeInputInvalid('Введите номер телефона правильно')
               }
            } else if (currentInputType === 'text' && currentInput.getAttribute('data-name')) {
               if (currentInputValue.length > 2 && new RegExp('^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$').test(currentInputValue)) {
                  makeInputValid()
               } else {
                  makeInputInvalid('Введите не менее 3 символов. Имя состоит только из букв')
               }
            } else if (currentInputType === 'text' && currentInput.getAttribute('data-code')) {
               if (/^[0-9]{5}$/.test(currentInputValue)) {
                  makeInputValid()
               } else {
                  makeInputInvalid('Введите 5-значный номер')
               }
            } else if (currentInputType === 'email') {
               const emailPattern = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i

               if (emailPattern.test(currentInputValue)) {
                  makeInputValid()
               } else {
                  makeInputInvalid('Введите адрес электронной почты правильно. Например: username@mail.ru')
               }
            } else if (currentInputType === 'password') {
               const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
               if (passwordPattern.test(currentInputValue)) {
                  makeInputValid()
               } else {
                  makeInputInvalid('Пароль должен содержать как минимум 1 цифру, одну строчную и одну прописную букву. Длина пароля не может быть меньше 6')
               }
            } else if (currentInputType === 'checkbox') {
               if (currentInput.checked) {
                  makeInputValid()
               } else {
                  makeInputInvalid('Вы должны согласиться с условиями')
               }
            }

            let temp = 0
            for (const input of authInputs) {
               if (input.classList.contains('valid')) temp++
            }
            authSubmitBtn.disabled = temp !== authInputs.length
         })
      })
   } catch (e) {
   }
}