import {selectOne, selectAll, removeClass, addClass} from './_functions'

export default function catalogModal() {
   try {
      const catalogButtonElement = selectOne('#catalog-btn'),
         catalogButtonElementIcon = selectOne('#catalog-btn img'),
         catalogModalLayer = selectOne('.catalog'),
         catalogModalInner = selectOne('.catalog__inner')

      catalogButtonElement.addEventListener('click', e => {
         catalogButtonElement.classList.toggle('catalog-btn--active')

         if (catalogButtonElement.classList.contains('catalog-btn--active')) {
            removeClass(catalogModalLayer, 'd-none')
            catalogButtonElementIcon.src = '/images/icons/times.svg'
            addClass(catalogModalInner, 'cabinet-dropdown-open')
            document.body.style.overflow = 'hidden'
         } else {
            addClass(catalogModalLayer, 'd-none')
            catalogButtonElementIcon.src = '/images/icons/catalog.svg'
            document.body.style.overflow = ''
         }
      })

      const catalogItems = selectAll('.catalog__item'),
         catalogContentItems = selectAll('.catalog__content__item')

      function showTabContent(i = 0) {
         catalogItems[i].classList.add('active')
         catalogContentItems[i].classList.remove('d-none')
      }

      function hideTabContent() {
         catalogItems.forEach(item => item.classList.remove('active'))
         catalogContentItems.forEach(item => item.classList.add('d-none'))
      }

      hideTabContent()
      showTabContent()

      catalogItems.forEach((item, index) => {
         item.addEventListener('mouseenter', e => {
            if (item === e.target) {
               hideTabContent()
               showTabContent(index)
            }
         })
      })

      window.addEventListener('keydown', e => {
         if (e.code === 'Escape') {
            if (catalogButtonElement.classList.contains('catalog-btn--active')) {
               removeClass(catalogButtonElement, 'catalog-btn--active')
               addClass(catalogModalLayer, 'd-none')
               catalogButtonElementIcon.src = '/images/icons/catalog.svg'
               document.body.style.overflow = ''
            }
         }
      })
   } catch (e) {
   }
}