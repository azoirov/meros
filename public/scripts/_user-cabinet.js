import {selectOne} from './_functions'
import {openToast, closingToast} from './_toast'
import {warningModalOpen, warningModalClose} from './_warning-modal'

export default function () {
    try {
        const changeAvatarModalOpen = selectOne('#change-avatar-modal-open'),
            changeAvatarModal = selectOne('.modal--change-avatar'),
            changeAvatarForm = selectOne('.modal-form--change-avatar'),
            changeAvatarImgInput = selectOne('#avatar-img-input'),
            avatarImgElement = selectOne('.modal-form__user-avatar img'),
            changeAvatarCancel = selectOne('#change-avatar-cancel')

        changeAvatarModalOpen.addEventListener('click', async e => {
            let response = await fetch('/users/current')
            response = await response.json()
            avatarImgElement.src = '/images/users/' + response.user.img
            changeAvatarModal.classList.remove('d-none')
            document.body.style.overflow = 'hidden'
        })

        changeAvatarCancel.addEventListener('click', e => {
            changeAvatarModal.classList.add('d-none')
            changeAvatarForm.reset()
            document.body.style.overflow = ''
        })

        changeAvatarImgInput.addEventListener('change', ev => {
            if (ev.target.files[0]) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    avatarImgElement.src = e.target.result
                }

                reader.readAsDataURL(ev.target.files[0])
            }
        })

        changeAvatarForm.addEventListener('submit', async e => {
            e.preventDefault()

            const formData = new FormData()

            if (changeAvatarImgInput.files[0]) {
                formData.append('avatar', changeAvatarImgInput.files[0])
            }

            let response = await fetch('/users/avatar', {
                method: 'POST',
                body: formData
            })

            response = await response.json()

            if (response.ok) {
                window.location.reload()
            }
        })
    } catch (e) {
    }

    try {
        const personalDataForm = selectOne('.personal-data__form'),
            firstName = personalDataForm.querySelector('#first-name'),
            lastName = personalDataForm.querySelector('#last-name')

        personalDataForm.addEventListener('submit', async e => {
            e.preventDefault()

            let response = await fetch('/users/edit-full-name', {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                method: 'POST',
                body: JSON.stringify({
                    firstName: firstName.value,
                    lastName: lastName.value
                })
            })

            response = await response.json()

            if (response.ok) {
                openToast('success', 'Ваши данные были успешно изменены')
            } else {
                openToast('failed', 'Произошла ошибка при изменении данных. Пожалуйста, попробуйте еще раз')
            }
            closingToast()
        })

        const phoneEmailChangeForm = selectOne('.credentials__form'),
            phone = phoneEmailChangeForm.querySelector('#phone'),
            email = phoneEmailChangeForm.querySelector('#email')

        phoneEmailChangeForm.addEventListener('submit', async e => {
            e.preventDefault()

            let response = await fetch('/users/edit-email-phone', {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                method: 'POST',
                body: JSON.stringify({
                    phone: phone.value.replace(/\D/g, ''),
                    email: email.value.trim().toLowerCase().replace(/ /g, '')
                })
            })

            response = await response.json()

            if (response.ok) {
                openToast('success', 'Ваши данные были успешно изменены')
            } else {
                openToast('failed', 'Произошла ошибка при изменении данных. Пожалуйста, попробуйте еще раз')
            }
            closingToast()
        })

        const exitLink = selectOne('#logout-all')
        exitLink.addEventListener('click', e => {
            let content = `
                <h3>Выйти</h3>
                <p>Вы действительно хотите выйти из всего устройства?</p>
                <a class="button-blue-sm" style="width: max-content" href="/users/logout-all">Да выйти</a>
                <button class="warning-modal-close">
                    <img src="/images/icons/times-modal.svg" alt="">
                </button>
            `
            warningModalOpen(content)
            warningModalClose()
        })
    } catch (e) {
    }

    try {
        const cabinetSidebar = selectOne('.cabinet__sidebar'),
            cabinetSidebarOpen = selectOne('.cabinet__sidebar__menu'),
            cabinetSidebarOpenImg = selectOne('.cabinet__sidebar__menu img')

        let isSideBarOpen = false
        cabinetSidebarOpen.addEventListener('click', e => {
            isSideBarOpen = !isSideBarOpen

            if (isSideBarOpen) {
                cabinetSidebar.style.left = '0'
                cabinetSidebarOpenImg.src = '/images/icons/times.svg'
            } else {
                cabinetSidebar.style.left = '-264px'
                cabinetSidebarOpenImg.src = '/images/icons/catalog.svg'
            }
        })

    } catch (e) {
    }
}