import {selectOne} from './_functions'

export default function filterModal() {
   try {
      const filterModalOpenBtn = selectOne('.filter-btn'),
         filterModalCloseBtn = selectOne('.filter__cancel'),
         filterModal = selectOne('.filter-aside')

      filterModalOpenBtn.onclick = () => {
         filterModal.style.top = 0
         document.body.style.overflow = 'hidden'
      }

      filterModalCloseBtn.onclick = () => {
         filterModal.style.top = '-1200%'
         document.body.style.overflow = ''
      }
   } catch (e) {

   }
}