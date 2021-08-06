import {selectAll} from './_functions'

export default function () {
   try {
      const makeAdminBtns = selectAll('[data-make-admin]'),
         removeAdminBtns = selectAll('[data-remove-admin]')

      makeAdminBtns.forEach(el => {
         el.addEventListener('click', async ev => {
            let response = await fetch('/admin/api/users/make-admin', {
               headers: {
                  'Content-Type': 'application/json; charset=utf-8'
               },
               method: 'POST',
               body: JSON.stringify({
                  user_id: ev.currentTarget.id
               })
            })
            response = await response.json()
            if (response.ok) {
               window.location.reload()
            }
         })
      })

      removeAdminBtns.forEach(el => {
         el.addEventListener('click', async ev => {
            let response = await fetch('/admin/api/users/remove-admin', {
               headers: {
                  'Content-Type': 'application/json; charset=utf-8'
               },
               method: 'POST',
               body: JSON.stringify({
                  user_id: ev.currentTarget.id
               })
            })
            response = await response.json()
            if (response.ok) {
               window.location.reload()
            }
         })
      })
   } catch (e) {

   }
}