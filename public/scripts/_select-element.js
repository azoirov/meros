import {removeClass, addClass, selectOne, selectAll} from './_functions'

export default function selectElement() {
   try {
      const selectElement = selectOne('.select'),
         selectSelected = selectOne('.select__selected'),
         selectList = selectOne('.select__list'),
         selectItems = selectAll('.select__item')

      function showSelectList() {
         removeClass(selectList, 'd-none')
      }

      function hideSelectList() {
         addClass(selectList, 'd-none')
      }

      selectSelected.addEventListener('click', e => {
         if (selectList.classList.contains('d-none')) {
            showSelectList()
         } else {
            hideSelectList()
         }
      })

      let selectedOptionIndex

      if (localStorage.getItem('selectedOptionIndex')) {
         selectedOptionIndex = localStorage.getItem('selectedOptionIndex')
         selectItems.forEach(item => item.classList.remove('select__item--active'))
         addClass(selectItems[selectedOptionIndex], 'select__item--active')
      } else {
         selectedOptionIndex = 0
         selectItems.forEach(item => item.classList.remove('select__item--active'))
         addClass(selectItems[selectedOptionIndex], 'select__item--active')
      }

      selectSelected.textContent = selectItems[selectedOptionIndex].textContent

      selectList.addEventListener('click', e => {
         const target = e.target
         selectItems.forEach((item, index) => {
            removeClass(item, 'select__item--active')

            if (target === item) {
               selectedOptionIndex = index
               selectSelected.textContent = selectItems[selectedOptionIndex].textContent
               localStorage.setItem('selectedOptionIndex', selectedOptionIndex)
            }
         })

         addClass(target, 'select__item--active')
      })

      window.addEventListener('keydown', e => {
         if (e.code === 'Escape') {
            hideSelectList()
         }
      })
      window.addEventListener('click', e => {
         if (e.target !== selectSelected) {
            hideSelectList()
         }
      })
   } catch (e) {
   }
}