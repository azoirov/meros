import {selectOne} from './_functions'

export default function () {
   try {
      const orderForm = selectOne('#order-form'),
         orderRegion = orderForm.querySelector('#region'),
         orderAddress = orderForm.querySelector('#address'),
         orderOwnerName = orderForm.querySelector('#name'),
         orderOwnerPhone = orderForm.querySelector('#phone'),
         orderOwnerComment = orderForm.querySelector('#review'),
         orderSubmitBtn = selectOne('#order-form-submit')

      orderForm.addEventListener('submit', async e => {
         e.preventDefault()

         const formData = new FormData()

         let response = await fetch('/order/bulk/', {
            headers: {
               'Content-Type': 'application/json; charset=utf-8'
            },
            method: 'POST',
            body: JSON.stringify({
               shipping_region: orderRegion.textContent,
               shipping_address: orderAddress.value,
               phone_number: orderOwnerPhone.value,
               full_name: orderOwnerName.value,
               is_shipped: false,
               is_payed: false,
               payment_method: 'card',
               description: orderOwnerComment.value
            })
         })

         response = await response.json()

         console.log(response)

         if (response.result.link) {
            window.location.href = response.result.link
         }
      })
   } catch (e) {  }
}