import {selectOne, selectAll, addClass, removeClass} from './_functions'

export default function categoriesMenu() {
   try {
      const categoriesMenuOpenBtn = selectOne('.menu-btn'),
         categoriesMenuCloseBtn = selectOne('.categories-menu__close'),
         categoriesMenu = selectOne('.categories-menu'),
         categoriesMenuItems = selectAll('.categories-menu__item')

      categoriesMenuOpenBtn.addEventListener('click', e => {
         categoriesMenu.style.top = 0
         document.body.style.overflow = 'hidden'
      })

      categoriesMenuCloseBtn.addEventListener('click', e => {
         categoriesMenu.style.top = '-1200%'
         document.body.style.overflow = ''
      })

      categoriesMenuItems.forEach(item => {
         item.addEventListener('click', e => {
            const target = e.currentTarget
            if (target.classList.contains('active')) {
               removeClass(target, 'active')
            } else {
               categoriesMenuItems.forEach(item => removeClass(item, 'active'))
               addClass(target, 'active')
            }
         })
      })
   } catch (e) {
   }
}