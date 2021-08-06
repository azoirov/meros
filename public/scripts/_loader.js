import {selectOne} from './_functions'

export default function loader() {
   try {
      const loader = selectOne('.loader')
      window.addEventListener('load', () => {
         loader.classList.add('d-none')
      })
   } catch (e) {
   }
}