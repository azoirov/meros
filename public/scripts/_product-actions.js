import {selectOne, selectAll} from './_functions'
import {openModal, modalClosing} from './_modal'

export default function () {
    try {
        const modalContent = selectOne('.my-modal-content'),
            productEditBtns = selectAll('[data-product-edit]'),
            productRemoveBtns = selectAll('[data-product-remove]')

        productRemoveBtns.forEach(el => {
            el.addEventListener('click', e => {
                modalContent.innerHTML = `
               <h4 class="display-6" style="font-size: 1.5rem">Are you sure delete?</h4>
               <div class="d-flex pt-3">
                  <button class="btn btn-secondary me-2" data-modal-close>Cancel</button>
                  <button class="btn btn-danger" id="${e.currentTarget.id}" data-yes-delete>Yes, delete</button>
               </div>
             `
                openModal()
                modalClosing()
                removeProduct()
            })
        })

        function removeProduct() {
            const yesDeleteBtn = selectOne('[data-yes-delete]')

            yesDeleteBtn.addEventListener('click', async e => {
                let response = await fetch('/admin/api/delete/product', {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        id: e.currentTarget.id
                    })
                })

                response = await response.json()

                if (response.ok) {
                    window.location.reload()
                }
            })
        }

        const inStockCheckboxes = selectAll('[data-in-stock]')

        inStockCheckboxes.forEach(el => {
            el.addEventListener('change', async e => {
                let response = await fetch('/admin/product/in-stock', {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        productId: e.target.id,
                        inStock: e.target.checked
                    })
                })

                response = await response.json()
            })
        })
    } catch (e) { }
}