import { selectOne, selectAll, addClass, removeClass } from './_functions'

function openModal() {
   const modal = selectOne('.my-modal')
   removeClass(modal, 'd-none')
   document.body.style.overflow = 'hidden'
}

function closeModal() {
   const modal = selectOne('.my-modal')
   addClass(modal, 'd-none')
   document.body.style.overflow = ''
}

function modalClosing() {
   const modalCloserElements = selectAll('[data-modal-close]')
   modalCloserElements.forEach(el => {
      el.addEventListener('click', ev => {
         closeModal()
      })
   })
}

export { openModal, closeModal, modalClosing }