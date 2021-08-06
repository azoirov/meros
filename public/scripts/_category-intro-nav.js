import { selectOne } from './_functions'

export default function () {
   try {
      const categoryIntroNav = selectOne('.category-intro__nav'),
         categoryIntroUL = selectOne('.category-intro__ul'),
         categoryIntroNavOpen = selectOne('.category-intro__nav-open')

      let show = false

      categoryIntroNavOpen.addEventListener('click', e => {
         show = !show

         if (show) {
            categoryIntroUL.style.display = 'block'
         } else {
            categoryIntroUL.style.display = 'none'
         }
      })
   } catch (e) {

   }
}