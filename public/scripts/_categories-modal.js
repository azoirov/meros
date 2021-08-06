import {selectOne, removeClass, addClass} from './_functions'

export default function categoriesModal() {
   try {
      const categoriesModal = selectOne('.categories-modal'),
         categoriesModalInner = selectOne('.categories-modal__inner'),
         categoriesModalCloseBtn = selectOne('#categories-modal-close'),
         categoriesModalOpenBtn = selectOne('.category-btn')

      function openCategoriesModal() {
         removeClass(categoriesModal, 'd-none')
         addClass(categoriesModalInner, 'cabinet-dropdown-open')
         document.body.style.overflow = 'hidden'
      }

      function closeCategoriesModal() {
         addClass(categoriesModal, 'd-none')
         removeClass(categoriesModalInner, 'cabinet-dropdown-open')
         document.body.style.overflow = ''
      }

      categoriesModalOpenBtn.addEventListener('click', e => {
         openCategoriesModal()
      })

      categoriesModalCloseBtn.addEventListener('click', e => {
         closeCategoriesModal()
      })

      categoriesModal.addEventListener('click', e => {
         if (e.target === categoriesModal) {
            closeCategoriesModal()
         }
      })

      window.addEventListener('keydown', e => {
         if (e.code === 'Escape') {
            closeCategoriesModal()
         }
      })
   } catch (e) {
   }
}