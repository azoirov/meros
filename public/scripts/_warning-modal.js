import { selectOne } from './_functions'

function warningModalOpen(content) {
    const warningModal = selectOne('.warning-modal'),
        warningModalContent = warningModal.querySelector('.warning-modal-content')

    warningModalContent.innerHTML = content
    warningModal.classList.remove('d-none')
    document.body.style.overflow = 'hidden'
}

function warningModalClose() {
    const warningModal = selectOne('.warning-modal'),
        warningModalClose = warningModal.querySelector('.warning-modal-close')

    warningModalClose.addEventListener('click', e => {
        warningModal.classList.add('d-none')
        document.body.style.overflow = ''
    })
}

export { warningModalOpen, warningModalClose }