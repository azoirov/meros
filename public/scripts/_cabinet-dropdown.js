import {selectOne, addClass, removeClass} from './_functions'

export default function cabinetDropdown() {
   try {
      const cabinetElement = selectOne('#cabinet'),
         cabinetDropdownElement = selectOne('.cabinet-dropdown')

      function openCabinetDropdown() {
         addClass(cabinetDropdownElement, 'cabinet-dropdown-open')
         removeClass(cabinetDropdownElement, 'cabinet-dropdown-close')
         removeClass(cabinetDropdownElement, 'd-none')
      }

      function closeCabinetDropdown() {
         removeClass(cabinetDropdownElement, 'cabinet-dropdown-open')
         addClass(cabinetDropdownElement, 'cabinet-dropdown-close')
         setTimeout(() => {
            addClass(cabinetDropdownElement, 'd-none')
         }, 300)
      }

      cabinetElement.addEventListener('click', () => {
         openCabinetDropdown()
      })

      window.addEventListener('keydown', e => {
         if (e.code === 'Escape') {
            closeCabinetDropdown()
         }
      })

      window.addEventListener('click', e => {
         if (e.target.getAttribute('data-cabinet-dropdown') !== 'true') {
            closeCabinetDropdown()
         }
      })
   } catch (e) {
   }
}