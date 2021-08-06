import { selectOne } from './_functions'

function openToast(status, message) {
    const toast = selectOne('.toast'),
        toastMessage = selectOne('.toast-message')

    if (status !== 'success') {
        if (!toast.classList.contains('toast--alert')) {
            toast.classList.add('toast--alert')
        }
    } else {
        if (toast.classList.contains('toast--alert')) {
            toast.classList.remove('toast--alert')
        }
    }

    toastMessage.textContent = message
    toast.classList.remove('d-none')
}

function closingToast() {
    const toast = selectOne('.toast'),
        toastCloser = selectOne('.toast-close')
    const toasterClosingTimer = setTimeout(() => {
        toast.classList.add('d-none')
    }, 5000)
    toastCloser.addEventListener('click', e => {
        toast.classList.add('d-none')
        clearTimeout(toasterClosingTimer)
    })
}

export { openToast, closingToast }